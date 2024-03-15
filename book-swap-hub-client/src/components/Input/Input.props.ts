import {ChangeEvent, DetailedHTMLProps, HTMLAttributes} from "react";

export interface InputProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
    type: string;
    placeholder: string;
    value: string;
    change: (value: string) => void;
}