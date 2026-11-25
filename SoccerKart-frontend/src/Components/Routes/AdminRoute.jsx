import { useState, useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../context/auth";
import Spinner, { PageLoader } from "./Spinner";
import { APIUrl } from "../../../utils";

/**
 * Guards admin-only routes. Shows a quiet loader while the server confirms
 * the admin (previously a "Redirecting in 3..." screen flashed for real admins).
 * Anyone who fails the check is redirected to the store.
 */
export default function AdminRoute() {
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
        const res = await axios.get(`${APIUrl}/admin-auth`, {
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
  return failed ? <Spinner path="/" /> : <PageLoader label="Verifying admin access..." />;
}
