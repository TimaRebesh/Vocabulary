import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import store from "../store/store";
import Main from '../components/Main';

describe('Main', () => {
    it("renders app successfully", async () => {
        const { getByText} = render(
            <Provider store={store}>
                <Main />
            </Provider>
        );
        const menu = await getByText(/Menu/i);
        // screen.getByRole('')
        // expect(menu).toBeInTheDocument();
        screen.logTestingPlaygroundURL()
    });

})