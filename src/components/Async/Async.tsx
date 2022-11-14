import React from "react";

const Async = (
  dynamicImport: () => Promise<{ default: React.FC }>
): React.ReactNode => {
  const Component = React.lazy(dynamicImport);

  return (
    <React.Suspense>
      <Component />
    </React.Suspense>
  );
};

export default Async;
