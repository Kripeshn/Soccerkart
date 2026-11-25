import { useState, useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../context/auth";
import Spinner, { PageLoader } from "./Spinner";
import { APIUrl } from "../../../utils";

/**
 * Guards routes that need a signed-in user.
 * Fix: on a page refresh `auth.token` is empty for the first render (it is
 * restored from localStorage in an effect), which used to bounce signed-in
 * users to /login. We now wait when a saved session exists.
 */
export default function PrivateRoute() {
  const [ok, setOk] = useState(false);
  const [failed, setFailed] = useState(false);
  const [auth] = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    let alive = true;
    const token = auth?.token;

    if (!token) {
      if (!localStorage.getItem("auth")) {
        navigate("/login", { state: location.pathname, replace: true });
      }
      return undefined;
    }

    (async () => {
      try {
        const res = await axios.get(`${APIUrl}/userauth`, {
          headers: { Authorization: token },
        });
        if (!alive) return;
        setOk(!!res.data?.ok);
        setFailed(!res.data?.ok);
      } catch (error) {
        console.log(error);
        if (alive) {
          setOk(false);
          setFailed(true);
        }
      }
    })();

    return () => {
      alive = false;
    };
  }, [auth?.token]);

  if (ok) return <Outlet />;
  return failed ? <Spinner /> : <PageLoader label="Checking your session..." />;
}
