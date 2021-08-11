import React from 'react'

interface HeaderProps {
    text: string;
}

const Header = (props: HeaderProps) => {
    return <h1>{props.text}</h1>;
}

export default Header;