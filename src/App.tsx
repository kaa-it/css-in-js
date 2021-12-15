import "./styles.css";
import { transform } from "./transform";
import React, { useState, useMemo } from "react";
import styled from "styled-components";

const calculateStyleRules = <T extends {} = {}>(
	styles: TemplateStringsArray, 
	keys: Array<(props: T) => any | any>,
	p: Pick<React.PropsWithChildren<T>, Exclude<keyof T, "children">>
) => {
	const styleRules = (styles as unknown) as string[];
	let completedRules: Array<string> = [];
	let toBeCalculated: Array<string> = [];
	styleRules.forEach((element: string) => {
		element.split(";").forEach((rule) => {
			const splitted = rule.split(":");
			if (splitted.length && splitted[1] === " ") {
				toBeCalculated.push(rule);
			} else {
				completedRules.push(rule);
			}
		});
	});
	return transform(
		[
			...completedRules.map((rule) => rule.trim()).filter(Boolean),
			...toBeCalculated.map(
				(rule, index) => rule.trim() + keys[index](p as T)
			)
		].join(";")
	);
};

const h2 = <T extends {} = {}>(
	styles: TemplateStringsArray,
	...keys: Array<(props: T) => any | any>
): React.FC<T> => ({ children, ...p }) => {
	const style = useMemo(() => calculateStyleRules(styles, keys, p), [p]);
	return <h2 style={style}>{children}</h2>;
};

const H2Custom = h2<{ toggled: boolean }>`
  background-color: ${(p) => (p.toggled ? "black" : "yellow")};
  padding: 5px;
  color: ${(p) => (p.toggled ? "orange" : "blue")};
`;

const H2Styled = styled.h2<{ toggled: boolean }>`
	background-color: ${(p) => (p.toggled ? "black" : "yellow")};
	padding: 5px;
	color: ${(p) => (p.toggled ? "orange" : "blue")};
`;

export default function App() {
	const [toggled, setToggled] = useState(false);
	return (
		<div className="App">
			<H2Custom toggled={toggled}>Это собственная реализация</H2Custom>
			<H2Styled toggled={toggled}>Это Styled Components</H2Styled>
			<button onClick={() => setToggled(!toggled)}>+</button>
		</div>
	);
}
