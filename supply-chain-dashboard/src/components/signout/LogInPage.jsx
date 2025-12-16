import axios from "axios";
import logo from "../navbar/hilton-pharma-logo.png";
import { useNavigate, useLocation } from "react-router-dom";
import { AppProvider } from "@toolpad/core/AppProvider";
import { SignInPage } from "@toolpad/core/SignInPage";
import { useTheme } from "@mui/material/styles";

const providers = [{ id: "credentials", name: "Credentials" }];

const BRANDING = {
    logo: (
        <img
            src={logo}
            alt="hilton pharma logo"
            style={{ height: 24 }}
        />
    ),
    title: "",
};

const LogInPage = () => {
    const navigate = useNavigate();
    const theme = useTheme();
    const location = useLocation();
    const redirectTo = location.state?.from?.pathname || "/";
    // ✅ THIS is called when user clicks "Sign in"
    const signIn = async (provider, formData) => {
        try {
            const email = formData.get("email");
            const password = formData.get("password");

            const res = await axios.post("http://localhost:5000/api/auth/login", { email, password });

            localStorage.setItem("token", res.data.token);
            localStorage.setItem("user", JSON.stringify(res.data.user || null));

            // redirect back to where user attempted to go, or to home
            navigate(redirectTo, { replace: true });

            return { success: true };
        } catch (error) {
            console.error(error.response?.data || error.message);
            return { error: "Invalid email or password" };
        }
    };


    return (
        <AppProvider branding={BRANDING} theme={theme}>
            <SignInPage
                signIn={signIn}
                providers={providers}
                slotProps={{
                    emailField: { autoFocus: true },
                    form: { noValidate: true },
                }}
            />
        </AppProvider>
    );
};

export default LogInPage;
