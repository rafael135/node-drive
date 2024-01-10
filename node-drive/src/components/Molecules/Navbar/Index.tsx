import { Form, Link, Route, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useContext, useLayoutEffect, useRef, useState } from "react";
import { Avatar, Dropdown } from "flowbite-react";
import { UserAuthContext } from "../../../contexts/UserContext";

import { BsFillPersonFill } from "react-icons/bs";
import NavImg from "./NavImg";
import { AnimatePresence, motion } from "framer-motion";
import Select from "../../Atoms/Select/Index";

const Navbar = () => {

    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const authCtx = useContext(UserAuthContext);

    const [expandOptions, setExpandOptions] = useState<boolean>(false);

    const [searchText, setSearchText] = useState<string>(searchParams.get("search") ?? "");
    const searchFormRef = useRef<HTMLFormElement | null>(null);

    let searchTextInput = useRef<HTMLInputElement | null>(null);
    let searchContainer = useRef<HTMLInputElement | null>(null);

    const toggleSearchOpts = () => {
        searchContainer.current!.classList.toggle("opened");
        searchTextInput.current!.addEventListener("focusout", sOptsEvent);
    }

    const sOptsEvent = (e: FocusEvent) => {
        if (e.target == null || searchContainer.current == null) {
            return;
        }

        let input = (e.target as HTMLInputElement);

        searchContainer.current!.classList.toggle("opened");

        removeSOptsEvent(input);
    }

    const removeSOptsEvent = (input: HTMLInputElement) => {
        input.removeEventListener("focusout", sOptsEvent);
    }

    const handleSearch = () => {
        if (searchText == "") {
            return;
        }

        searchFormRef.current!.submit();
    }

    const handleExpandOptions = () => {
        setExpandOptions(!expandOptions);
    }

    const expandOptionsVariants = {
        open: { opacity: 1, y: 0, zIndex: "5" },
        closed: { opacity: 0, y: "-100%", zIndex: "-1" }
    };

    return (
        <header>
            <Link to={"/"} className="navbar-logo">
                NodeDrive
            </Link>
            <Form ref={searchFormRef} className="flex flex-row mx-auto" role="search" method="GET" action="/files/search">
                <div className="navbar-searchFiles" ref={searchContainer}> {/* gap-0 flex-col */}
                    {/*<div className="flex flex-row gap-2">*/}
                    <input
                        type="text"
                        value={searchText}
                        placeholder="Pesquisar por seus arquivos"
                        name="search"
                        onChange={(e) => { setSearchText(e.target.value); }}
                        ref={searchTextInput}
                        onFocus={toggleSearchOpts}
                        onKeyUp={(e) => {
                            if (e.key == "Enter") {
                                handleSearch();
                            }
                        }}
                    />

                    <span
                        className="hover:bg-gray-300/60"
                        onClick={handleSearch}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
                        </svg>
                    </span>

                    {/*}
                        <span
                            className="hover:bg-gray-300"
                            onClick={handleExpandOptions}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                <path d="M8.932.727c-.243-.97-1.62-.97-1.864 0l-.071.286a.96.96 0 0 1-1.622.434l-.205-.211c-.695-.719-1.888-.03-1.613.931l.08.284a.96.96 0 0 1-1.186 1.187l-.284-.081c-.96-.275-1.65.918-.931 1.613l.211.205a.96.96 0 0 1-.434 1.622l-.286.071c-.97.243-.97 1.62 0 1.864l.286.071a.96.96 0 0 1 .434 1.622l-.211.205c-.719.695-.03 1.888.931 1.613l.284-.08a.96.96 0 0 1 1.187 1.187l-.081.283c-.275.96.918 1.65 1.613.931l.205-.211a.96.96 0 0 1 1.622.434l.071.286c.243.97 1.62.97 1.864 0l.071-.286a.96.96 0 0 1 1.622-.434l.205.211c.695.719 1.888.03 1.613-.931l-.08-.284a.96.96 0 0 1 1.187-1.187l.283.081c.96.275 1.65-.918.931-1.613l-.211-.205a.96.96 0 0 1 .434-1.622l.286-.071c.97-.243.97-1.62 0-1.864l-.286-.071a.96.96 0 0 1-.434-1.622l.211-.205c.719-.695.03-1.888-.931-1.613l-.284.08a.96.96 0 0 1-1.187-1.186l.081-.284c.275-.96-.918-1.65-1.613-.931l-.205.211a.96.96 0 0 1-1.622-.434L8.932.727zM8 12.997a4.998 4.998 0 1 1 0-9.995 4.998 4.998 0 0 1 0 9.996z" />
                            </svg>
                        </span>
                        {*/}
                    {/* </div>*/}

                    {/*
                    <AnimatePresence>
                        {(expandOptions == true) &&
                            <motion.div
                                animate={(expandOptions == true) ? "open" : "closed"}
                                variants={expandOptionsVariants}
                                exit={{ opacity: 0, y: "-100%", zIndex: "-1" }}
                                transition={{ duration: 0.3, type: "spring" }}
                                className="flex flex-col"
                            >
                                <Select name="filter" defaultValue="fileName">
                                    <option value="fileName">Nome do arquivo</option>
                                    <option value="author">Autor</option>
                                </Select>
                            </motion.div>
                        }
                    </AnimatePresence>
                    */}
                </div>
            </Form>

            <div className="navbar-user">
                <Dropdown arrowIcon={false} inline label={<Avatar className="navbar-avatar" alt="" img={(authCtx?.user?.avatar != null) ? authCtx!.user!.avatar! : ""} bordered rounded />}>
                    <AnimatePresence>
                        <motion.div
                            initial={{ opacity: 0 }}
                            transition={{ type: "spring", duration: 0.25 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            <Dropdown.Header>
                                {(authCtx?.user != null) &&
                                    <>
                                        <span className="block text-sm">
                                            {authCtx.user.name}
                                        </span>
                                        <span className="block truncate text-sm font-medium">
                                            {authCtx.user.email}
                                        </span>
                                    </>
                                }

                                {(authCtx?.user == null) &&
                                    <>
                                        <span>Entre em sua conta!</span>
                                    </>
                                }

                            </Dropdown.Header>

                            {(authCtx?.user != null) &&
                                <>
                                    <Dropdown.Item onClick={() => navigate("/user/config")}>
                                        Configurações
                                    </Dropdown.Item>

                                    <Dropdown.Item onClick={() => navigate("/logout")}>
                                        Sair
                                    </Dropdown.Item>
                                </>
                            }

                            {(authCtx?.user == null) &&
                                <Dropdown.Item onClick={() => navigate("/login")}>
                                    Entrar
                                </Dropdown.Item>
                            }
                        </motion.div>
                    </AnimatePresence>

                </Dropdown>
            </div>
        </header>
    );
}

export default Navbar;