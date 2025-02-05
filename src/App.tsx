import { useVirtualizer } from "@tanstack/react-virtual";
import * as React from "react";
import { useRef } from "react";
import {
  mergeProps,
  useFocusRing,
  useGridList,
  useGridListItem,
  useGridListSelectionCheckbox,
} from "react-aria";
import {
  Button,
  Dialog,
  Heading,
  Input,
  Label,
  Modal,
  TextField,
} from "react-aria-components";
import { Item, useListState } from "react-stately";
import { Switch } from "./Switch";
import "./App.css";
import {
  FloatingFocusManager,
  FloatingPortal,
  useDismiss,
  useFloating,
  useInteractions,
  useRole,
} from "@floating-ui/react";

const SimpleDialog = ({ isOpen, setIsOpen }) => {
  const { context } = useFloating();
  const floating = useFloating({
    open: isOpen,
    onOpenChange: (next) => {
      if (!next) {
        setIsOpen(false);
      }
    },
  });

  const { getFloatingProps } = useInteractions([
    useDismiss(floating.context, {
      enabled: true,
      outsidePress: false, // https://github.com/floating-ui/floating-ui/discussions/2138
    }),
    useRole(floating.context),
  ]);
  return (
    <FloatingPortal root={document.querySelector("#root") as HTMLElement}>
      <FloatingFocusManager context={context}>
        <div {...getFloatingProps()}>
          <Modal
            isOpen={isOpen}
            onOpenChange={(t) => {
              setIsOpen(t);
            }}
          >
            <Dialog>
              <form>
                <Heading slot="title">Sign up</Heading>
                <TextField autoFocus>
                  <Label>First Name:</Label>
                  <Input />
                </TextField>
                <TextField>
                  <Label>Last Name:</Label>
                  <Input />
                </TextField>
                <Button slot="close">Submit</Button>
              </form>
            </Dialog>
          </Modal>
        </div>
      </FloatingFocusManager>
    </FloatingPortal>
  );
};

function ListCheckbox({ item, state }) {
  const { checkboxProps } = useGridListSelectionCheckbox(
    { key: item.key },
    state
  );
  return <Switch {...checkboxProps} />;
}

function List(props) {
  const state = useListState(props);
  console.log(
    "state.selectionManager",
    state.selectionManager.isFocused,
    state.selectionManager.focusedKey
  );
  const ref = useRef<HTMLUListElement | null>(null);
  const { gridProps } = useGridList(
    { ...props, isVirtualized: true },
    state,
    ref
  );
  return (
    <ul {...gridProps} ref={ref} className="list" style={{ listStyle: "none" }}>
      {[...state.collection].map((item) => (
        <ListItem key={item.key} item={item} state={state} />
      ))}
    </ul>
  );
}

function ListItem({ item, state }) {
  const ref = React.useRef(null);
  const { rowProps, gridCellProps, isPressed } = useGridListItem(
    { node: item },
    state,
    ref
  );

  const { isFocusVisible, focusProps } = useFocusRing();
  const showCheckbox =
    state.selectionManager.selectionMode !== "none" &&
    state.selectionManager.selectionBehavior === "toggle";
  return (
    <li
      {...mergeProps(rowProps, focusProps)}
      ref={ref}
      className={`${isPressed ? "pressed" : ""} ${
        isFocusVisible ? "focus-visible" : ""
      }`}
    >
      <div {...gridCellProps}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          {showCheckbox && <ListCheckbox item={item} state={state} />}
          {item.rendered}
        </div>
      </div>
    </li>
  );
}

function App() {
  // The scrollable element for your list
  const parentRef = React.useRef(null);
  const [isOpen, setIsOpen] = React.useState(false);

  // The virtualizer
  const virtualizer = useVirtualizer({
    count: 1000,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 25,
  });

  return (
    <>
      <div>
        <input name="test"></input>
      </div>
      <div
        ref={parentRef}
        style={{
          height: `400px`,
          overflow: "auto", // Make it scroll!
        }}
      >
        <div
          style={{
            height: `${virtualizer.getTotalSize()}px`,
            width: "100%",
            position: "relative",
            willChange: "transform",
          }}
        >
          <List
            aria-label="Example List"
            selectionMode="single"
            selectionBehavior="replace"
          >
            {virtualizer.getVirtualItems().map((virtualItem) => (
              <Item
                key={virtualItem.key}
                textValue={`Item ${virtualItem.index}`}
              >
                <div
                  key={virtualItem.key}
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: `${virtualItem.size}px`,
                    transform: `translateY(${virtualItem.start}px)`,
                  }}
                >
                  <span>Item {virtualItem.index} </span>
                  <button onClick={() => setIsOpen(true)}>Open Dialog</button>
                </div>
              </Item>
            ))}
          </List>
        </div>
      </div>
      <SimpleDialog isOpen={isOpen} setIsOpen={setIsOpen} />
    </>
  );
}

export default App;
