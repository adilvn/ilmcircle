
const Languageoption = (props) => {
    return (
        <div>
            <select className="lang-dropdown" onChange={props.onChange}>
                <option>Language</option>
                <option value={'en'}>English</option>
                {/* <option value={'ar'}>Arabic</option> */}
            </select>
        </div>
    )
}
export default Languageoption;