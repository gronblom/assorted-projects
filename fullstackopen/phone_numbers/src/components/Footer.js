const Footer = ({message}) => {
    if (message === null) {
      return null
    }
    const footerStyle = {
        color: 'green',
        background: 'lightgrey',
        fontSize: '20px',
        borderStyle: 'solid',
        borderRadius: '5px',
        padding: '10px',
        marginBottom: '10px'
    }
    return (
        <div style={footerStyle}>
            {message}
        </div>
    )
}

export default Footer
