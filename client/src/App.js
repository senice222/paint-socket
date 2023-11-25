import style from './styles/app.module.scss'
import Toolbar from "./components/Toolbar";
import SettingBar from "./components/SettingBar";
import Canvas from "./components/Canvas";

function App() {
    return (
        <div className={style.app}>
            <Toolbar/>
            <SettingBar/>
            <Canvas />
        </div>
    );
}

export default App;
