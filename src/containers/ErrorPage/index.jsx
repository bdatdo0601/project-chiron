import React from "react";
import { useNavigate } from "react-router-dom";
import Button from "rsuite/Button";

const ErrorPage = () => {
  const navigate = useNavigate();
  return (
    <div className="h-screen w-screen p-5 text-center grid content-center grid-cols-1 relative">
      <h1 className="font-bold text-8xl my-5 text-red-500">404 - Not Found</h1>
      <div>
        <Button
          appearance="primary"
          onClick={() => {
            navigate("/");
          }}
          className="w-24"
        >
          Go Home
        </Button>
      </div>
    </div>
  );
};

export default ErrorPage;
