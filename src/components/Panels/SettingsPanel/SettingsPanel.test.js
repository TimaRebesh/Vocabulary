import { render } from "@testing-library/react"
import { createStore } from 'react-redux';
import SettingsPanel from "./SettingsPanel"

const renderWithRedux = (
    component,
    { initialState, store = createStore}
)

// test('switch to black theme', () => {
//     render(<SettingsPanel/>)
// })