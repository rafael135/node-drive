import { RefObject } from "react";
import { InputErrorType } from "../types/Config";

const showError = (inputRef: RefObject<HTMLInputElement>, defaultPlaceholder: string, msg: string) => {
    inputRef.current!.placeholder = msg;
    inputRef.current!.classList.add("errored");
    inputRef.current!.value = "";

    const event = () => {
        inputRef.current!.placeholder = defaultPlaceholder;
        inputRef.current!.classList.remove("errored");

        inputRef.current!.removeEventListener("click", event);
    }

    inputRef.current!.addEventListener("click", event);
}

export const checkInputsErrors = (inputsRefs: RefObject<HTMLInputElement>[], defaultPlaceholders: string[], errors: InputErrorType[]) => {
    let errorsLength = errors.length;
    let resolvedErrors = 0;

    inputsRefs.forEach((input, idx) => {
        errors.forEach((error) => {
            if(error.target == input.current!.id) {
                resolvedErrors++;
                showError(input, defaultPlaceholders[idx], error.msg);
            }
        });
    });

    if(resolvedErrors == errorsLength) {
        return;
    }

    if(errors[errors.length-1].target == "all") {
        showError(inputsRefs[errors.length], defaultPlaceholders[defaultPlaceholders.length-1], errors[errors.length-1].msg);
    }

    /*
    let form = inputsRefs[0].current!.parentElement;

    while(form != null && form.tagName != "FORM") {
        form = form.parentElement;
    }

    if(form != null) {
        let errorSpan = document.createElement("span");
        errorSpan.classList.add("flex-1", "text-center", "font-semibold", "text-red-600");
        
        // TODO
        const event = () => {
            form!.removeChild(errorSpan);

            form!.removeEventListener("focusin", event);
        }

        form.appendChild(errorSpan);
        form.addEventListener("focusin", event);
    }
    */
}