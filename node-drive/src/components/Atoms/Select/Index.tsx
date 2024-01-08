import { ReactNode } from "react";
import styled from "styled-components";

const StyledSelect = styled.select({

});

const StyledLabel = styled.label({

});


type props = {
    children: ReactNode;
    id?: string;
    name: string;
    label?: string;
    defaultValue: string;
};

const Select = ({children, id, name, label, defaultValue}: props) => {

    return (
        <>
            <StyledLabel
                htmlFor={name}
                id={`${name}Label`}
            >
                
            </StyledLabel>

            <StyledSelect name={name} id={name} defaultValue="">
                {children}
            </StyledSelect>
        </>
    )
}

export default Select;