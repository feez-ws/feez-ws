import React from "react";

const Async = (
  dynamicImport: () => Promise<{ default: React.FC }>
): React.ReactNode => {
  const Component = React.lazy(dynamicImport);

  if (typeof window === "undefined") {
    throw new Error("Async is designed to work for client-side routes.");
  }

  return (
    <React.Suspense>
      <Component />
    </React.Suspense>
  );
};

export default Async;
