import React, { useEffect, useState } from "react";

import { Home } from "../Home";
import { ContractMethods } from "../smart_contract/ContractMethods";
import { EMIGraph } from "./EMIGraph";
import { EMIBarTable } from "./EMIBarTable";

export const EMICalculator = () => {
  const [loanAmount, setLoanAmount] = useState(5000000); // Default: $50,00,000
  const [interestRate, setInterestRate] = useState(10); // Default: 10.5%
  const [loanTenure, setLoanTenure] = useState({ value: 20, unit: "year" }); // Default: 20 years

  const [monthlyEMI, setMonthlyEMI] = useState(); // Default: $50,00,000
  const [emiDetail, setEmiDetail] = useState(); // Default: $50,00,000

  const loanAmountNumber = Array.from({ length: 9 }, (_, index) => index);
  const rangeNumber = Array.from({ length: 7 }, (_, index) => index);

  const amountTrackStyle = {
    background: `linear-gradient(to right, #ed8c2b 0%, #ed8c2b ${loanAmount / 200000}%,
                #ccc ${loanAmount / 200000}%, #ccc 100%)`,
  };

  const percentageTrackStyle = {
    background: `linear-gradient(to right, #ed8c2b 0%, #ed8c2b ${((interestRate - 5) / 15) * 100}%, #ccc ${((interestRate - 5) / 15) * 100}%, #ccc 100%)`,
  };

  const durationTrackStyle = {
    background: `linear-gradient(to right, #ed8c2b 0%, #ed8c2b ${(loanTenure.value / (loanTenure.unit === "year" ? 30 : 360)) * 100}%,
                #ccc ${(loanTenure.value / (loanTenure.unit === "year" ? 30 : 360)) * 100}%, #ccc 100%)`,
  };

  const handleLoanAmountChange = (e) => {
    const regex = /^(?:100(?:\.0+)?|\d{0,2}(?:\.\d+)?|0(?:\.\d+)?)$/;

    if (
      (e.target.value !== "" && regex.test(e.target.value)) ||
      e.target.value >= 0
    ) {
      setLoanAmount(e.target.value);
    }
  };

  const handleInterestRateChange = (e) => {
    const regex = /^(?:100(?:\.0+)?|\d{0,2}(?:\.\d+)?|0(?:\.\d+)?)$/;

    if (
      (e.target.value !== "" && regex.test(e.target.value)) ||
      (e.target.value >= 0 && e.target.value <= 100)
    ) {
      setInterestRate(e.target.value);
    }
  };

  const handleDurationChange = (e) => {
    const regex = /^(?:100(?:\.0+)?|\d{0,2}(?:\.\d+)?|0(?:\.\d+)?)$/;

    if (
      (e.target.value !== "" && regex.test(e.target.value)) ||
      e.target.value >= 0
    ) {
      setLoanTenure({
        value: e.target.value,
        unit: loanTenure.unit,
      });
    }
  };

  const handleLoanTenureChange = (e) => {
    const value = e.target.value;

    let duration = document.getElementById("loanterm").value;
    let newValue = value === "year" ? duration / 12 : duration * 12;

    setLoanTenure({
      value: newValue,
      unit: value,
    });
  };

  const handleSliderChange = (e) => {
    const amount = parseInt(e.target.value);
    setLoanAmount(amount);
  };

  useEffect(() => {
    setAllValues();
  }, [loanAmount, interestRate, loanTenure]);

  const setAllValues = async () => {
    let principal = loanAmount;
    let interest = interestRate * 100;
    let duration =
      loanTenure.unit == "year" ? loanTenure.value * 12 : loanTenure.value;

    let contract = await ContractMethods();
    let result = contract.getEMI(principal, interest, duration);

    let newResult = await result;

    setMonthlyEMI(newResult.emi);
    setEmiDetail(newResult);
  };

  return (
    <>
      <Home />

      <div className="calculatorcontainer">
        <div className="emicalculatorcontainer">
          <div id="loanformcontainer" className="row">
            <div id="emicalculatordashboard" className="col-sm-12">
              <div id="emicalculatorinnerformwrapper">
                <form id="emicalculatorform">
                  <div className="form-horizontal" id="emicalculatorinnerform">
                    {/* Loan Amount */}

                    <div className="row form-group lamount">
                      <label
                        className="col-lg-4 control-label"
                        htmlFor="loanamount">
                        Loan Amount
                      </label>
                      <div className="col-lg-6">
                        <div className="input-group">
                          <input
                            className="form-control"
                            id="loanamount"
                            name="loanamount"
                            value={loanAmount.toLocaleString("en-IN")}
                            type="tel"
                            onChange={handleLoanAmountChange}
                          />
                          <div className="input-group-append">
                            <span className="input-group-text">$</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <input
                      type="range"
                      min="0"
                      max="20000000"
                      step="100000"
                      value={loanAmount}
                      onChange={handleSliderChange}
                      className="ui-slider-range"
                      style={amountTrackStyle}
                    />

                    <div id="loanamountsteps" className="steps">
                      {loanAmountNumber.map((number) => (
                        <span
                          key={number}
                          className="tick"
                          style={{
                            left: parseInt(2) + parseInt(12 * number) + "%",
                          }}>
                          |<br />
                          <span className="marker">{25 * number}L</span>
                        </span>
                      ))}
                    </div>

                    {/* Interest Rate */}
                    <div className="sep row form-group lint">
                      <label
                        className="col-lg-4 control-label"
                        htmlFor="loaninterest">
                        Interest Rate
                      </label>
                      <div className="col-lg-6">
                        <div className="input-group">
                          <input
                            type="tel"
                            className="form-control"
                            id="loaninterest"
                            name="loaninterest"
                            value={interestRate}
                            onChange={handleInterestRateChange}
                          />
                          <div className="input-group-append">
                            <span className="input-group-text">%</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <input
                      type="range"
                      min="5"
                      max="20"
                      step="0.25"
                      value={interestRate}
                      onChange={(e) =>
                        setInterestRate(parseFloat(e.target.value))
                      }
                      className="ui-slider-range"
                      style={percentageTrackStyle}
                    />

                    <div id="loanamountsteps" className="steps">
                      {rangeNumber.map((number) => (
                        <span
                          key={number}
                          className="tick"
                          style={{
                            left: parseInt(2) + parseInt(16 * number) + "%",
                          }}>
                          |<br />
                          <span className="marker">{5 + 2.5 * number}%</span>
                        </span>
                      ))}
                    </div>

                    {/* Loan Tenure */}
                    <div className="sep row form-group lterm">
                      <label
                        className="col-lg-4 control-label"
                        htmlFor="loanterm">
                        Loan Tenure
                      </label>

                      <div className="col-lg-6">
                        <div className="loantermwrapper">
                          <div className="input-group">
                            <input
                              className="form-control"
                              id="loanterm"
                              name="loanterm"
                              value={loanTenure.value}
                              type="tel"
                              onChange={handleDurationChange}
                            />
                            <div
                              className="input-group-append "
                              data-toggle="buttons">
                              <div
                                className="btn-group btn-group-toggle"
                                data-toggle="buttons">
                                <label
                                  className={`btn btn-light ${
                                    loanTenure.unit === "year" ? "active" : ""
                                  }`}>
                                  <input
                                    type="radio"
                                    name="loantenure"
                                    value="year"
                                    tabIndex="4"
                                    autoComplete="off"
                                    checked={loanTenure.unit === "year"}
                                    onChange={handleLoanTenureChange}
                                  />{" "}
                                  Yr
                                </label>
                                <label
                                  className={`btn btn-light ${
                                    loanTenure.unit === "month" ? "active" : ""
                                  }`}>
                                  <input
                                    type="radio"
                                    name="loantenure"
                                    value="month"
                                    tabIndex="5"
                                    autoComplete="off"
                                    checked={loanTenure.unit === "month"}
                                    onChange={handleLoanTenureChange}
                                  />{" "}
                                  Mo
                                </label>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <input
                      type="range"
                      min="0"
                      max={loanTenure.unit == "year" ? 30 : 360}
                      step="0.50"
                      value={loanTenure.value}
                      onChange={(e) =>
                        setLoanTenure({
                          ...loanTenure,
                          value: parseInt(e.target.value),
                        })
                      }
                      className="ui-slider-range"
                      style={durationTrackStyle}
                    />

                    <div id="loanamountsteps" className="steps">
                      {rangeNumber.map((number) => (
                        <span
                          key={number}
                          className="tick"
                          style={{
                            left: parseInt(2) + parseInt(16 * number) + "%",
                          }}>
                          |<br />
                          <span className="marker">
                            {loanTenure.unit == "year"
                              ? 5 * number
                              : 5 * 12 * number}
                          </span>
                        </span>
                      ))}
                    </div>
                  </div>
                </form>
                {monthlyEMI > 0 ? (
                  <EMIGraph
                    principal={loanAmount}
                    interest={loanTenure}
                    monthlyEMI={monthlyEMI}
                  />
                ) : (
                  <></>
                )}
              </div>
            </div>
          </div>

          <div id="emipaymenttable">
            {"ss " + monthlyEMI}
            {monthlyEMI > 0 ? (
              <EMIBarTable
                principal={loanAmount}
                interest={loanTenure}
                monthlyEMI={monthlyEMI}
                emiDetail={emiDetail}
              />
            ) : (
              <></>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
//
