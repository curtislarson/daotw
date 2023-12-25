import Icon from "./Icon";

export type NavbarItemProps = {
  href: string;
  /** @default "left" */
  align?: "left" | "right";
  active?: boolean;
} & (
  | {
      text: string;
    }
  | { image: string; tooltip?: string }
);

export default function NavbarItem(props: NavbarItemProps) {
  if ("image" in props) {
    return (
      <li>
        <a href={props.href}>
          <Icon src={props.image} tooltip={props.tooltip} />
        </a>
      </li>
    );
  } else {
    return (
      <li>
        <a
          href={props.href}
          className={`w-max rounded-md text-xs normal-case sm:text-sm ${
            props.active ? "btn-outline btn-primary" : "btn-ghost"
          }`}
        >
          {props.text}
        </a>
      </li>
    );
  }
}
