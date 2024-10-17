import React from "react";

const CreditsPage = () => {
  return (
    <div>
      <h1 className="text-blancofondo font-sans uppercase m-auto pt-40 text-center text-4xl relative">
        Créditos
      </h1>
      <div className="bg-negrofondo p-2">
        <p className="text-blancofondo font-sans text-center text-xl">
          Este proyecto fue desarrollado por:
        </p>
        <ul className="text-blancofondo font-sans text-center text-xl">
          <li>Carlos Alberto González</li>
          <li>Carlos Daniel González</li>
          <li>María Fernanda González</li>
          <li>María José González</li>
        </ul>
      </div>
    </div>
  );
};

export default CreditsPage;
