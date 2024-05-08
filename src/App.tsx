import {useBearStore} from "./stores";
import "./index.css"

interface IProps {
    name: string
}

function App1(props: IProps) {

    console.log('props', props);
    const {bears} = useBearStore();

    return (
        <>
            <p className={"text-2xl"}>Rwemote {props?.name} {bears}</p>
            <img src={'/react.svg'} className="logo react" alt="React logo"/>
        </>
    )
        ;
}

export default App1;
