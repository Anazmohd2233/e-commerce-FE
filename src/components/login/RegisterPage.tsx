import { useRef, useState,useEffect } from "react";
import Breadcrumb from "../breadcrumb/Breadcrumb";
import { Form } from "react-bootstrap";
import * as formik from "formik";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const RegisterPage = () => {
  const { Formik } = formik;
  const formikRef = useRef<any>(null);
  const [showOTPInput, setShowOTPInput] = useState(false);
  const [otpInput, setOtpInput] = useState('');

  const schema = yup.object().shape({
    full_name: yup.string().required("Full name is required"),
    email: yup
      .string()
      .email("Invalid email address")
      .required("Email is required"),
    mob: yup
      .string()
      .matches(/^[0-9]{10}$/, "Phone number must be 10 digits")
      .required("Phone number is required"),
    code: yup.string().required("Country code is required"),
  });

  const initialValues = {
    full_name: "",
    email: "",
    mob: "",
    code: "91", 
  };

  const navigate = useNavigate();
  
  const {
    signup,
    verifyUserOTP,
    loading,
    error,
    requiresOTP,
    otp,
    token,
    isAuthenticated,
    clearAuthError,
  } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/'); 
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (requiresOTP && otp) {
      setShowOTPInput(true);
      console.log('OTP required. OTP sent:', otp); 
    }
  }, [requiresOTP, otp]);

  const onSubmit = async (values: any) => {
    try {
      await signup({
        mob: values.mob,
        full_name: values.full_name,
        email: values.email,
        code: values.code,
      });
    } catch (error) {
      console.error('Signup failed:', error);
    }
  };

  const handleOTPVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpInput.trim() || !token) return;
    
    try {
      await verifyUserOTP({
        otpKey: token,
        otp: parseInt(otpInput.trim()),
      });
    } catch (error) {
      console.error('OTP verification failed:', error);
    }
  };

  const handleBackToSignup = () => {
    setShowOTPInput(false);
    setOtpInput('');
    clearAuthError();
    // Reset form
    if (formikRef.current) {
      formikRef.current.resetForm();
    }
  };

  return (
    <>
      <Breadcrumb title={"Register Page"} />
      <section className="gi-register padding-tb-40">
        <div className="container">
          <div className="section-title-2">
            <h2 className="gi-title">
              Register<span></span>
            </h2>
            <p>Best place to buy and sell digital products.</p>
          </div>
          <div className="row">
            <div className="gi-register-wrapper">
              <div className="gi-register-container">
                <div className="gi-register-form">
                  {error && (
                    <div className="alert alert-danger mb-3" role="alert">
                      {error}
                    </div>
                  )}

                  {!showOTPInput ? (
                    // Signup Form
                    <Formik
                      innerRef={formikRef}
                      validationSchema={schema}
                      onSubmit={onSubmit}
                      initialValues={initialValues}
                    >
                      {({
                        handleSubmit,
                        handleChange,
                        values,
                        errors,
                      }) => (
                        <Form noValidate onSubmit={handleSubmit}>
                          <span className="gi-register-wrap">
                            <label htmlFor="full_name">Full Name*</label>
                            <Form.Group>
                              <Form.Control
                                type="text"
                                name="full_name"
                                placeholder="Enter your full name"
                                value={values.full_name}
                                onChange={handleChange}
                                isInvalid={!!errors.full_name}
                                required
                                disabled={loading}
                              />
                              {errors.full_name &&
                                typeof errors.full_name === "string" && (
                                  <Form.Control.Feedback type="invalid">
                                    {errors.full_name}
                                  </Form.Control.Feedback>
                                )}
                            </Form.Group>
                          </span>

                          <span
                            style={{ marginTop: "10px" }}
                            className="gi-register-wrap"
                          >
                            <label>Email*</label>
                            <Form.Group>
                              <Form.Control
                                type="email"
                                name="email"
                                placeholder="Enter your email address"
                                required
                                value={values.email}
                                onChange={handleChange}
                                isInvalid={!!errors.email}
                                disabled={loading}
                              />
                              {errors.email &&
                                typeof errors.email === "string" && (
                                  <Form.Control.Feedback type="invalid">
                                    {errors.email}
                                  </Form.Control.Feedback>
                                )}
                            </Form.Group>
                          </span>

                          <span
                            style={{ marginTop: "10px" }}
                            className="gi-register-wrap gi-register-half"
                          >
                            <label>Country Code*</label>
                            <Form.Group>
                              <Form.Select
                                name="code"
                                value={values.code}
                                onChange={handleChange}
                                isInvalid={!!errors.code}
                                required
                                disabled={loading}
                              >
                                <option value="91">+91 (India)</option>
                                <option value="1">+1 (USA/Canada)</option>
                                <option value="44">+44 (UK)</option>
                                <option value="61">+61 (Australia)</option>
                                {/* Add more country codes as needed */}
                              </Form.Select>
                              {errors.code &&
                                typeof errors.code === "string" && (
                                  <Form.Control.Feedback type="invalid">
                                    {errors.code}
                                  </Form.Control.Feedback>
                                )}
                            </Form.Group>
                          </span>

                          <span
                            style={{ marginTop: "10px" }}
                            className="gi-register-wrap gi-register-half"
                          >
                            <label>Phone Number*</label>
                            <Form.Group>
                              <Form.Control
                                type="text"
                                name="mob"
                                placeholder="Enter your phone number"
                                pattern="^\d{10}$"
                                required
                                value={values.mob}
                                onChange={handleChange}
                                isInvalid={!!errors.mob}
                                disabled={loading}
                              />
                              {errors.mob &&
                                typeof errors.mob === "string" && (
                                  <Form.Control.Feedback type="invalid">
                                    {errors.mob}
                                  </Form.Control.Feedback>
                                )}
                            </Form.Group>
                          </span>

                          <span
                            style={{ marginTop: "20px" }}
                            className="gi-register-wrap gi-register-btn"
                          >
                            <span>
                              Already have an account?
                              <Link to="/login"> Login</Link>
                            </span>
                            <button 
                              className="gi-btn-1" 
                              type="submit"
                              disabled={loading}
                            >
                              {loading ? 'Creating Account...' : 'Register'}
                            </button>
                          </span>
                        </Form>
                      )}
                    </Formik>
                  ) : (
                    // OTP Verification Form
                    <form onSubmit={handleOTPVerification}>
                      <div className="text-center mb-4">
                        <h4>Verify Your Phone Number</h4>
                        <p className="text-muted">
                          We've sent an OTP to your phone number. Please enter it below.
                        </p>
                        <p className="text-info">OTP: {otp}</p>
                      </div>

                      <span className="gi-register-wrap">
                        <label htmlFor="otp">Enter OTP*</label>
                        <Form.Group>
                          <Form.Control
                            type="number"
                            id="otp"
                            value={otpInput}
                            onChange={(e) => setOtpInput(e.target.value)}
                            placeholder="Enter the 4-digit OTP"
                            required
                            disabled={loading}
                            className="text-center"
                            style={{ fontSize: '1.2rem', letterSpacing: '0.5rem' }}
                          />
                        </Form.Group>
                      </span>

                      <span
                        style={{ marginTop: "20px" }}
                        className="gi-register-wrap gi-register-btn"
                      >
                        <button
                          type="button"
                          onClick={handleBackToSignup}
                          className="gi-btn-2 me-3"
                          disabled={loading}
                        >
                          Back to Signup
                        </button>
                        <button
                          type="submit"
                          disabled={loading || !otpInput.trim()}
                          className="gi-btn-1"
                        >
                          {loading ? 'Verifying...' : 'Verify OTP'}
                        </button>
                      </span>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default RegisterPage;