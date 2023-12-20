
type props = {
    base64Img: string;
}

const NavImg = ({ base64Img }: props) => {


    return (
        <img src={base64Img} />
    );
}

export default NavImg;