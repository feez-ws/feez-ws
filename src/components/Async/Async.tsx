import React from "react";

const Async = (
  dynamicImport: () => Promise<{ default: React.FC }>
): React.ReactNode => {
  const Component = React.lazy(dynamicImport);

  if (typeof window === "undefined") {
    return <Component />;
  }

  return (
    <React.Suspense>
      <Component />
    </React.Suspense>
  );
};

export default Async;
