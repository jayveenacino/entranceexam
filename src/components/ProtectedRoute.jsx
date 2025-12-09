import React from "react";
import { Navigate, Outlet } from "react-router-dom";

export default function ExamProtectedRoute() {
    const user = localStorage.getItem("exam_user");

    if (!user) {
        return <Navigate to="/register" replace />;
    }

    return <Outlet />;
}
