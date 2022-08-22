import './Tag.css'

const Tag = ({ text }: { text: string }) => {

    return <span className="tag">{text}</span>
}

export default Tag