import { useContext, useEffect, useState } from "react";
import api from "../interceptor/axios_interceptor";
import { useToken } from "./token_hooks";
import { message } from "antd";
import { ModalContext } from "../context/modal_context";

const useTrainingById = (id, modal) => {
    const [fetchingTraining, setFetchingTraining] = useState(false);
    const [defaultValues, setDefaultValues] = useState({
        defaultTrainers: [],
        defaultGrades: [],
        defaultSchools: [],
        currentGrade: {}
    });
    const { access_token } = useToken();
    const [trainings, setTrainings] = useState([{}])

    const fetchTrainingById = async () => {
        setFetchingTraining(true);
        await api({
            method: 'GET',
            url: `/training/${id}/`,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + access_token
            }
        }).then(response => {
            const trainers = response?.data?.trainers?.map(trainer => ({
                label: trainer.username,
                value: trainer.id
            }));

            const grades = response?.data?.grades?.map(grade => ({
                label: grade?.grades,
                value: grade?.id
            }))

            const schools = response?.data?.schools?.map(school => ({
                label: school?.name,
                value: school?.id
            }))

            const currentGrade = {
                label: response?.data?.currentGradeDetails?.grades,
                value: response?.data?.currentGradeDetails?.id
            }
            setDefaultValues({
                defaultGrades: grades,
                defaultSchools: schools,
                defaultTrainers: trainers,
                currentGrade: currentGrade
            })
            setTrainings(response.data);
            setFetchingTraining(false);
            // console.log(response);
        }).catch(err => {
            setFetchingTraining(false);
            console.log(err);
        })
    }

    useEffect(() => {
        modal &&
            fetchTrainingById();
    }, [id, modal])

    return { trainings, defaultValues, fetchingTraining, setDefaultValues }
}

export default useTrainingById



// All the trainings from django server

export const useTrainings = () => {
    const { setTrainingModal } = useContext(ModalContext);
    const [trainingsData, setTrainingsData] = useState([]);
    const [loadingTraining, setLoading] = useState([]);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
    });
    const [userId, setUserId] = useState();

    const { access_token } = useToken();

    const fetchTraining = async (params = {}) => {
        setLoading(true);
        await api({
            method: 'GET',
            url: `${userId ? `/training/trainer/${userId}` : "/training/"}`,
            params: { ...params },
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + access_token
            }
        })
            .then((response) => {
                setLoading(false);
                setTrainingsData(response.data?.results);
                setPagination({
                    ...pagination,
                    total: response.data?.count
                })
            })
            .catch((error) => {
                console.log(error);
                setLoading(false);
            })
    }

    const addTraining = async (values) => {
        setLoading(true);
        await api({
            method: 'POST',
            url: "/training/",
            data: JSON.stringify(values),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + access_token
            }
        }).then(response => {
            if(response.data){
                setLoading(false);
                message.success("Training added successfully");
                setTrainingModal(false);
            }else{
                setLoading(false);
                message.error(response.message);
                
            }
        }).catch(err => {
            setLoading(false);
            message.error("Something went wrong");
        })
    }

    useEffect(() => {
        fetchTraining({
            limit: pagination.pageSize,
            offset: (pagination.current - 1) * pagination.pageSize
        });
    }, [pagination.current, pagination.pageSize, userId])

    return { setPagination, pagination, loadingTraining, trainingsData, setUserId, fetchTraining, addTraining}
}

export const useAllTrainings = () => {
    const [trainingsData, setTrainingsData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [robotics, setRobotics] = useState([]);
    const [cs, setCS] = useState([]);
    const [dc, setDC] = useState([]);
    const [aeromodelling, setAeromodelling] = useState([]);

    const {access_token} = useToken();

    const fetchTrainings = async () => {
        setLoading(true);
        await api({
            method: 'GET',
            url: "/training/all",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + access_token
            }
        })
            .then((response) => {
                setLoading(false);
                setTrainingsData(response.data);
                setRobotics(response.data?.filter((training) => training.trainingType === "ROBOTICS"))
                setCS(response.data?.filter((training) => training.trainingType === "COMPUTER SCIENCE"))
                setDC(response.data?.filter((training) => training.trainingType === "DOUBT SESSION"))
                setAeromodelling(response.data?.filter((training) => training.trainingType === "AEROMODELLING"))
            })
            .catch((error) => {
                console.log(error);
                setLoading(false)
            })
    }

    

    useEffect(() => {
        fetchTrainings();
    }, [])

    return {trainingsData, loading, robotics, cs, dc, aeromodelling}
}

