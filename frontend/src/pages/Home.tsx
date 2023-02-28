import React from "react";
import Header from "../components/Header";

export default function Home() {
  return (
    <>
      <main>
        <div className="MuiBox-root css-1ybfalx"></div>
        <div className="MuiBox-root css-0">
          <div className="MuiBox-root css-1el9aj6">
            <div className="MuiGrid-root MuiGrid-container MuiGrid-spacing-xs-4 css-1tz8m30">
              <div className="MuiGrid-root MuiGrid-container MuiGrid-item MuiGrid-grid-xs-12 MuiGrid-grid-md-6 css-himpyl">
                <div className="MuiBox-root css-0 aos-init aos-animate">
                  <div className="MuiBox-root css-1qm1lh">
                    <h2 className="MuiTypography-root MuiTypography-h2 css-1bzl0gy">
                      Get insights into
                      <br />
                      your business'{" "}
                      <span className="MuiTypography-root MuiTypography-inherit css-1tukh29">
                        success
                      </span>
                    </h2>
                  </div>
                  <div className="MuiBox-root css-i3pbo">
                    <p className="MuiTypography-root MuiTypography-h6 css-66t1bw">
                      MyForecaster will give you a quick glance at your
                      company's future. Plan your staffing, manage your
                      inventory and more wit hteh help of MyForecaster.
                    </p>
                  </div>
                  <div className="MuiBox-root css-14hwaxf">
                    <a
                      className="MuiButton-root MuiButton-contained MuiButton-containedPrimary MuiButton-sizeLarge MuiButton-containedSizeLarge MuiButtonBase-root  css-1witfr3"
                      href="/start"
                    >
                      Quick Start{" "}
                      <span className="MuiTouchRipple-root css-w0pj6f"></span>
                    </a>
                    <div className="MuiBox-root css-np4b2e">
                      <a
                        className="MuiButton-root MuiButton-outlined MuiButton-outlinedPrimary MuiButton-sizeLarge MuiButton-outlinedSizeLarge MuiButtonBase-root  css-7vsgjg"
                        href="/docs"
                      >
                        View documentation{" "}
                        <span className="MuiTouchRipple-root css-w0pj6f"></span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
