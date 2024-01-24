import { JSX } from "solid-js/jsx-runtime";
import styles from "./Modal.module.css";

export interface IModal {
  children: JSX.Element;
  id: string;
}

export default function Modal(props: IModal) {
  return (
    <dialog
      id={props.id}
      onClick={() => {
        (document.getElementById(props.id) as HTMLDialogElement).close();
      }}
    >
      <div class={styles.content}>{props.children}</div>
    </dialog>
  );
}
