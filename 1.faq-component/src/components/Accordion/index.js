import { Children, cloneElement, useMemo, useRef, useState } from "react";

import { useInitialMount } from "../../hooks/useInitialMount";
import { randomId } from "../../utils";

import styles from "./index.module.css";

export default function Accordion({
  children,
  openIndex: externalOpenIndex,
  onChange
}) {
  // states
  const [internalOpenIndex, setOpenIndex] = useState(-1);

  // derived
  const isExternalControl = externalOpenIndex !== undefined;
  const openIndex = isExternalControl ? externalOpenIndex : internalOpenIndex;

  // refs
  const isInitialMount = useInitialMount();
  const containerRef = useRef(null);
  const itemsRef = useRef([]);
  const items = itemsRef.current;
  const focusOnItem = (idx) => items[idx]?.focus();

  // handlers
  const handleKeyDown = (evt) => {
    const target = evt.target;
    const index = items.findIndex((el) => el === target);
    if (index < 0) return;
    if (evt.key === "ArrowDown") {
      evt.preventDefault();
      if (index === items.length - 1) {
        focusOnItem(0);
      } else {
        focusOnItem(index + 1);
      }
    } else if (evt.key === "ArrowUp") {
      evt.preventDefault();
      if (index === 0) {
        focusOnItem(items.length - 1);
      } else {
        focusOnItem(index - 1);
      }
    }
  };

  // elements
  const transformedChildren = useMemo(
    () =>
      Children.map(children, (child, idx) => {
        if (child.type.name !== "AccordionItem") {
          // throw new Error("Accordion only accepts Accordion.Item as direct child");
          return child;
        }
        if (child.props.initialOpen && isInitialMount) {
          setOpenIndex(idx);
        }
        return cloneElement(child, {
          open: idx === openIndex,
          onToggle: () => {
            if (!isExternalControl) {
              setOpenIndex((prev) => {
                return prev === idx ? -1 : idx;
              });
            }
            onChange?.(idx);
          },
          appendToRef: (el) => (items[idx] = el)
        });
      }),
    [children, isExternalControl, openIndex, onChange, items, isInitialMount]
  );

  return (
    <ul
      className={styles.accordion}
      ref={containerRef}
      tabIndex={-1}
      onKeyDown={handleKeyDown}
    >
      {transformedChildren}
    </ul>
  );
}

const icon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path
      fillRule="evenodd"
      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
      clipRule="evenodd"
    />
  </svg>
);

const AccordionItem = ({ header, children, open, onToggle, appendToRef }) => {
  const { current: id } = useRef(randomId("acc"));

  return (
    <li className={styles.item}>
      <button
        ref={appendToRef}
        id={`content-${id}`}
        aria-expanded={open}
        aria-controls={`content-${id}`}
        onClick={onToggle}
      >
        <span className={`${styles.chrevron} ${open ? styles.open : ""}`}>
          {icon}
        </span>
        <div>{header}</div>
      </button>
      {open && (
        <div
          id={`content-${id}`}
          aria-labelledby={`toggle-${id}`}
          role="region"
          className={styles.content}
        >
          {children}
        </div>
      )}
    </li>
  );
};

Accordion.Item = AccordionItem;
