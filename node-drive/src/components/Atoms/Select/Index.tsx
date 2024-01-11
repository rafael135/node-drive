import React, { ReactNode } from "react";
import styled from "styled-components";

const StyledSelect = styled.select({
    borderRadius: "0.375rem"
});

const StyledLabel = styled.label({

});


type props = {
    children: ReactNode;
    id?: string;
    name: string;
    className?: string;
    label?: string;
    defaultValue: string;
    disabled?: boolean;
    onChange?: (e: React.ChangeEvent) => void;
};

const Select = ({children, id, name, className, label, defaultValue, disabled, onChange}: props) => {

    return (
        <>
            {(label != undefined) &&
                <StyledLabel
                    htmlFor={name}
                    id={`${name}Label`}
                >
                    {label}
                </StyledLabel>
            }

            <StyledSelect
                name={name}
                id={name}
                defaultValue={defaultValue}
                disabled={disabled}
                onChange={onChange}
                className={`${className ?? ""}`}
            >
                {children}
            </StyledSelect>
        </>
    )
}

export default Select;