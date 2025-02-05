import * as React from "react";
import { useFocusRing, useSwitch, VisuallyHidden } from "react-aria";
import { useToggleState } from "react-stately";

export function Switch(props) {
  const state = useToggleState(props);
  const ref = React.useRef(null);
  const { inputProps } = useSwitch(props, state, ref);
  const { isFocusVisible, focusProps } = useFocusRing();
  return (
    <label style={{ display: "flex", alignItems: "center" }}>
      <VisuallyHidden>
        <input {...inputProps} {...focusProps} />
      </VisuallyHidden>
      <svg width={40} height={24} aria-hidden="true" style={{ marginRight: 4 }}>
        <rect
          x={4}
          y={4}
          width={32}
          height={16}
          rx={8}
          fill={state.isSelected ? "orange" : "gray"}
        />
        <circle cx={state.isSelected ? 28 : 12} cy={12} r={5} fill="white" />
        {isFocusVisible && (
          <rect
            x={1}
            y={1}
            width={38}
            height={22}
            rx={11}
            fill="none"
            stroke="orange"
            strokeWidth={2}
          />
        )}
      </svg>

      {props.children}
    </label>
  );
}
