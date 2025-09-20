// import * as React from "react";

// import { cn } from "@/lib/utils";

// const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
//   ({ className, type, onChange, ...props }, ref) => {
//     return (
//       <input
//         type={type}
//         onChange={onChange}
//         className={cn(
//           "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
//           className
//         )}
//         ref={ref}
//         {...props}
//       />
//     );
//   }
// );
// Input.displayName = "Input";

// export { Input };

import * as React from "react";
import { cn } from "@/lib/utils"; // Assuming you have a utility function for classnames

// Define the Input component with forwardRef and handle value, onChange, and defaultValue logic
const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  (
    { className, type, value, onChange, defaultValue, readOnly, ...props },
    ref
  ) => {
    // If controlled, ensure there's an onChange handler
    if (value !== undefined && onChange === undefined) {
      console.warn(
        "You provided a `value` prop to the Input component without an `onChange` handler. This will render a read-only input."
      );
    }

    return (
      <input
        type={type}
        value={value} // If value is provided, it's a controlled input
        defaultValue={defaultValue} // If no value, use defaultValue for uncontrolled
        onChange={onChange} // Ensure onChange is passed for controlled inputs
        readOnly={readOnly} // Make the input read-only if needed
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className
        )}
        ref={ref}
        {...props} // Spread any remaining props
      />
    );
  }
);

Input.displayName = "Input"; // Set display name for better debugging

export { Input };
