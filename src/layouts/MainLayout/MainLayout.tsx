import React, { Suspense } from "react";
import { LoadingIndicator, Center } from "components";
import { ErrorBoundary } from "components/ErrorBoundary/ErrorBoundary";
import { Outlet } from "react-router-dom";

export const MainLayout = () => {
  return (
    <div className="box-border pt-8 h-screen">
      <ErrorBoundary>
        <Suspense
          fallback={
            <Center>
              <LoadingIndicator />
            </Center>
          }
        >
          <Outlet />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
};
