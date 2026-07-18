import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { ConfigProvider } from "antd";
import { ThemeProvider } from "styled-components";
import App from "./App.jsx";
import store from "./redux/store.js";
import { theme, antdTheme } from "./styles/theme/theme";
import { GlobalStyles } from "./styles/global/GlobalStyles";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <ThemeProvider theme={theme}>
      <ConfigProvider theme={antdTheme}>
        <GlobalStyles />
        <App />
      </ConfigProvider>
    </ThemeProvider>
  </Provider>
);
