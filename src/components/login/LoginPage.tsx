import { Link, useNavigate } from "react-router-dom";
import { useRef, useState, useEffect } from "react";
import Breadcrumb from "../breadcrumb/Breadcrumb";
import { Container, Form } from "react-bootstrap";
import * as formik from "formik";
import * as yup from "yup";
import { useAuth } from "../../hooks/useAuth";

const LoginPage = () => {
  const { Formik } = formik;
  const formikRef = useRef<any>(null);
  const [showOTPInput, setShowOTPInput] = useState(false);
  const [otpInput, setOtpInput] = useState('');

  const schema = yup.object().shape({
    phone: yup
      .string()
      .matches(/^[0-9]{10}$/, "Phone number must be 10 digits")
      .required("Phone number is required"),
  });

  const initialValues = {
    phone: "",
  };

  const navigate = useNavigate();
  
  const {
    login,
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
      await login({
        phone: values.phone,
      });
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const handleOTPVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpInput.trim() || !token) return;
    
    try {
      await verifyUserOTP({
        otpKey: token,
        otp: String(otpInput.trim()),
      });
    } catch (error) {
      console.error('OTP verification failed:', error);
    }
  };

  const handleBackToLogin = () => {
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
      <Breadcrumb title={"Login Page"} />
      <section className="gi-login padding-tb-40">
        <Container>
          <div className="section-title-2">
            <h2 className="gi-title">
              Login<span></span>
            </h2>
            <p>Get access to your Orders, Wishlist and Recommendations.</p>
          </div>
          <div className="gi-login-content">
            <div className="gi-login-box">
              <div className="gi-login-wrapper">
                <div className="gi-login-container">
                  <div className="gi-login-form">
                    {error && (
                      <div className="alert alert-danger mb-3" role="alert">
                        {error}
                      </div>
                    )}

                    {!showOTPInput ? (
                      // Login Form
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
                            <span className="gi-login-wrap">
                              <label htmlFor="phone">Phone Number*</label>
                              <Form.Group>
                                <Form.Control
                                  type="text"
                                  name="phone"
                                  placeholder="Enter your phone number"
                                  pattern="^\d{10}$"
                                  required
                                  value={values.phone}
                                  onChange={handleChange}
                                  isInvalid={!!errors.phone}
                                  disabled={loading}
                                />
                                {errors.phone &&
                                  typeof errors.phone === "string" && (
                                    <Form.Control.Feedback type="invalid">
                                      {errors.phone}
                                    </Form.Control.Feedback>
                                  )}
                              </Form.Group>
                            </span>

                            <span className="gi-login-wrap gi-login-btn">
                              <span>
                                Don't have an account?
                                <Link to="/register"> Register</Link>
                              </span>
                              <button 
                                className="gi-btn-1" 
                                type="submit"
                                disabled={loading}
                              >
                                {loading ? 'Sending OTP...' : 'Login'}
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

                        <span className="gi-login-wrap">
                          <label htmlFor="otp">Enter OTP*</label>
                          <Form.Group>
                            <Form.Control
                              type="text"
                              id="otp"
                              value={otpInput}
                              onChange={(e) => setOtpInput(e.target.value)}
                              placeholder="Enter the 4-digit OTP"
                              required
                              disabled={loading}
                        
                             
                            />
                          </Form.Group>
                        </span>

                        <span className="gi-login-wrap gi-login-btn">
                          <button
                            type="button"
                            onClick={handleBackToLogin}
                            className="gi-btn-2 me-3"
                            disabled={loading}
                          >
                            Back to Login
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
            <div className="gi-login-box d-n-991">
              <div className="gi-login-img">
              <img src="/assets/img/common/login.png" alt="login" />

              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
};

export default LoginPage;
