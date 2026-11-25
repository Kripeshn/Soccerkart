import React from "react";
import UserMenu from "../../Components/Layout/UserMenu";
import { useAuth } from "../../context/auth";
import "./user.css";

const Field = ({ label, value }) => (
  <div className="ud-row">
    <dt>{label}</dt>
    <dd className={value ? "" : "is-empty"}>{value || "Not provided"}</dd>
  </div>
);

/** Read-only for now: saving profile changes needs a backend update endpoint. */
const Profile = () => {
  const [auth] = useAuth();
  const user = auth?.user || {};

  return (
    <div className="ud">
      <UserMenu />
      <div className="ud-main">
        <div className="ud-head">
          <h1>Your profile</h1>
          <p>The details saved with your account.</p>
        </div>

        <section className="sk-card ud-details">
          <dl>
            <Field label="Full name" value={user.name} />
            <Field label="Email" value={user.email} />
            <Field label="Phone" value={user.phone} />
            <Field label="Address" value={user.address} />
          </dl>
        </section>
      </div>
    </div>
  );
};

export default Profile;
