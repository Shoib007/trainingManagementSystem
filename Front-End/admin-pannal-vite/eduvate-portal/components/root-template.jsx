import React, { useContext, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { Context } from '../context/user_context';
import { CSTraining, TotalTrainers, TotalTrainings } from './Statistics';
import Sidebar from './Sidebar';


const RootComponent = () => {
    const { isAuthenticated } = useContext(Context);
    const redirect = useNavigate();

    useEffect(() => {
        if (!isAuthenticated) {
            redirect("/login");
        }
    }, [isAuthenticated])

    return (
        <div className='flex gap-2'>
            {/* Menu Section */}
            <div className='h-screen fixed top-0 left-0 bottom-0 w-20 sm:w-40'>
                <Sidebar />
            </div>

            {/* Right Content */}
            <div className='sm:ml-40 ml-20 flex flex-col w-full gap-2 p-2 border'>

                {/* Header Section */}
                <div className='flex justify-start items-center gap-4 h-32 w-full'>
                    <TotalTrainers />
                    <TotalTrainings />
                    <CSTraining/>
                </div>

                {/* Body Section */}
                <div className='w-full p-2'>
                    <Outlet />

                </div>

            </div>
        </div>
    )
};
export default React.memo(RootComponent);