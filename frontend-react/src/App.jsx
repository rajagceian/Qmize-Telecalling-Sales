import { useState } from "react";
import "./App.css";

const API_URL =
  `${import.meta.env.VITE_API_URL}/api/candidate-info`;

function App() {

  const [submitted, setSubmitted] = useState(false);
  const [applicationId, setApplicationId] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [photoPreview, setPhotoPreview] = useState(null);
  const [photoName, setPhotoName] = useState("");
  const [resumeName, setResumeName] = useState("");

  const [photoError, setPhotoError] = useState("");
  const [resumeError, setResumeError] = useState("");


  const formatFileSize = (bytes) => {

    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    }

    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };


  const handlePhotoChange = (e) => {

    setPhotoError("");

    const file = e.target.files[0];

    if (!file) {
      setPhotoPreview(null);
      setPhotoName("");
      return;
    }

    const allowedTypes = [
      "image/jpeg",
      "image/png"
    ];

    if (!allowedTypes.includes(file.type)) {

      setPhotoError(
        "Please upload JPG, JPEG or PNG image."
      );

      e.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {

      setPhotoError(
        "Photo size must be less than 5 MB."
      );

      e.target.value = "";
      return;
    }

    setPhotoName(file.name);

    const reader = new FileReader();

    reader.onload = () => {
      setPhotoPreview(reader.result);
    };

    reader.readAsDataURL(file);
  };


  const handleResumeChange = (e) => {

    setResumeError("");

    const file = e.target.files[0];

    if (!file) {
      setResumeName("");
      return;
    }

    const isPDF =
      file.type === "application/pdf" ||
      file.name.toLowerCase().endsWith(".pdf");

    if (!isPDF) {

      setResumeError(
        "Only PDF files are allowed."
      );

      e.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {

      setResumeError(
        "Resume size must be less than 5 MB."
      );

      e.target.value = "";
      return;
    }

    setResumeName(
      `${file.name} (${formatFileSize(file.size)})`
    );
  };


  const handleSubmit = async (e) => {

    e.preventDefault();

    setError("");
    setPhotoError("");
    setResumeError("");

    const form = e.target;

    const phone =
      form.phoneNumber.value.trim();

    const whatsapp =
      form.whatsappNumber.value.trim();

    if (!/^[0-9]{10}$/.test(phone)) {

      setError(
        "Please enter a valid 10-digit phone number."
      );

      return;
    }

    if (!/^[0-9]{10}$/.test(whatsapp)) {

      setError(
        "Please enter a valid 10-digit WhatsApp number."
      );

      return;
    }


    // const photo =
    //   form.photo.files[0];

    const resume =
      form.resume.files[0];


    // if (!photo) {

    //   setPhotoError(
    //     "Please upload your photo."
    //   );

    //   return;
    // }


    if (!resume) {

      setResumeError(
        "Please upload your resume."
      );

      return;
    }


    if (resume.size > 5 * 1024 * 1024) {

      setResumeError(
        "Resume size must be less than 5 MB."
      );

      return;
    }


    setLoading(true);


    const formData = new FormData(form);


    try {

      const response = await fetch(
        API_URL,
        {
          method: "POST",
          body: formData
        }
      );


      const data = await response.json();

      console.log("Backend response:", data);


      if (!response.ok) {

        throw new Error(
          data.message ||
          "Application submission failed."
        );
      }


      const id =
        data.applicationId ||
        data.id ||
        "Successfully Submitted";


      setApplicationId(id);

      setSubmitted(true);

      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });


    } catch (err) {

      console.error(err);

      setError(
        err.message ||
        "Unable to submit application."
      );

    } finally {

      setLoading(false);
    }
  };


  /* ================= LOADER (shown while the request is in-flight) ================= */

  const Loader = () => (

    <div className="loading-overlay">

      <div className="loader-card">
        <div className="spinner"></div>
        <p>Submitting your application...</p>
        <small>Please wait, do not close this page.</small>
      </div>

    </div>
  );


  /* ================= CONFIRMATION ================= */

  if (submitted) {

    return (

      <div className="page">

        <Header />

        <section className="success-banner">

          <div className="success-card">

            <div className="success-icon">
              ✓
            </div>

            <h1>
              Application Submitted!
            </h1>

            <p>
              Thank you for applying for the
              <strong>
                {" "}Telecalling Sales Executive
              </strong>
              {" "}position at Qmize.
            </p>

            <p>
              Your details and documents have been
              successfully submitted.
            </p>


            <div className="application-id">

              <span>
                Application ID
              </span>

              <strong>
                {applicationId}
              </strong>

            </div>


            <div className="regards">

              <p>Warm Regards,</p>

              <a
                href="https://www.linkedin.com/in/raja-kumar-cse"
                target="_blank"
                rel="noopener noreferrer"
              >
                Raja Kumar
              </a>
              &nbsp; &nbsp;
              <a
                href="https://www.linkedin.com/in/sumit-jha-9025b12a6"
                target="_blank"
                rel="noopener noreferrer"
              >
                Sumit Jha
              </a>

              <span>
                TPO Coordinator, GCE Gaya
              </span>

            </div>

          </div>

        </section>

        <Footer />

      </div>
    );
  }


  /* ================= FORM ================= */

  return (

    <div className="page">

      {loading && <Loader />}

      <Header />


      <section className="banner">

        <h1>
          Telecalling Sales Executive – Student Application
        </h1>

        <p>
          Apply for the Telecalling Sales Executive opportunity at
          Qmize (IT &amp; Digital Marketing Services). Please provide
          accurate details and upload your latest resume.
        </p>

      </section>


      <main className="container">

        <div className="form-card">

          <div className="section-title">
            Student Details
          </div>

          <p className="section-description">
            Fill in your details carefully.
            All fields marked with
            <span className="required"> *</span>
            are mandatory. Eligibility: 12th Pass / Graduate,
            freshers and experienced candidates both welcome.
            Hindi communication is mandatory for this role.
          </p>


          {error && (

            <div className="error-box">
              {error}
            </div>

          )}


          <form onSubmit={handleSubmit}>

            <div className="form-grid">


              {/* NAME */}

              <FormField
                label="Full Name"
                name="name"
                placeholder="Enter your full name"
              />


              {/* EMAIL */}

              <FormField
                label="Email Address"
                name="email"
                type="email"
                placeholder="example@gmail.com"
              />


              {/* PHONE */}

              <FormField
                label="Phone Number"
                name="phoneNumber"
                type="tel"
                placeholder="10-digit mobile number"
                maxLength="10"
              />


              {/* WHATSAPP */}

              <FormField
                label="WhatsApp Number"
                name="whatsappNumber"
                type="tel"
                placeholder="10-digit WhatsApp number"
                maxLength="10"
              />


 {/* COLLEGE */}

<div className="form-group full">

  <label>
    College Name <span>*</span>
  </label>

  <select
    name="collegeName"
    required
  >

    <option value="">
      Select your college
    </option>

    <option value="Gaya College of Engineering, Gaya">
      Gaya College of Engineering, Gaya
    </option>

  </select>

</div>


              {/* REGISTRATION */}

              <FormField
                label="Registration Number"
                name="registrationNumber"
                placeholder="Enter registration number"
              />


              {/* QUALIFICATION */}

              <div className="form-group">

                <label>
                  Highest Qualification <span>*</span>
                </label>

                <select
                  name="qualification"
                  required
                >

                  <option value="">
                    Select qualification
                  </option>

                  <option value="12th Pass">
                    12th Pass
                  </option>

                  <option value="Graduate">
                    Graduate (Pursuing/Completed)
                  </option>

                </select>

              </div>


              {/* PASSOUT */}

              <div className="form-group">

                <label>
                  Passout Year <span>*</span>
                </label>

                <select
                  name="passoutYear"
                  required
                >

                  <option value="">
                    Select passout year
                  </option>

                  <option value="2026">
                    2026
                  </option>

                  <option value="2027">
                    2027
                  </option>

                </select>

              </div>


              {/* EXPERIENCE */}

              <div className="form-group">

                <label>
                  Relevant Experience <span>*</span>
                </label>

                <select
                  name="experience"
                  required
                >

                  <option value="">
                    Select an option
                  </option>

                  <option value="Fresher">
                    Fresher
                  </option>

                  <option value="Experienced">
                    Experienced
                  </option>

                </select>

              </div>


              {/* HINDI COMMUNICATION */}

              <div className="form-group">

                <label>
                  Comfortable with Hindi Communication? <span>*</span>
                </label>

                <select
                  name="hindiCommunication"
                  required
                >

                  <option value="">
                    Select an option
                  </option>

                  <option value="Yes">
                    Yes
                  </option>

                  <option value="No">
                    No
                  </option>

                </select>

              </div>


              {/* PHOTO */}

              {/* <div className="form-group">

                <label>
                  Passport Size Photo <span>*</span>
                </label>

                <div className="upload-box">

                  <label
                    className="upload-label"
                    htmlFor="photo"
                  >

                    <div className="upload-icon">
                      📷
                    </div>

                    <div>

                      <strong>
                        Upload Photo
                      </strong>

                      <small>
                        JPG, JPEG or PNG • Max 5 MB
                      </small>

                    </div>

                  </label>

                  <input
                    id="photo"
                    name="photo"
                    type="file"
                    accept="image/jpeg,image/png"
                    onChange={handlePhotoChange}
                    required
                  />


                  {photoPreview && (

                    <div className="photo-preview">

                      <img
                        src={photoPreview}
                        alt="Preview"
                      />

                      <span>
                        {photoName}
                      </span>

                    </div>

                  )}


                  {photoError && (

                    <div className="file-error">
                      {photoError}
                    </div>

                  )}

                </div>

              </div> */}


              {/* RESUME */}

              <div className="form-group full">

                <label>
                  Resume <span>*</span>
                </label>

                <div className="upload-box">

                  <label
                    className="upload-label"
                    htmlFor="resume"
                  >

                    <div className="upload-icon">
                      📄
                    </div>

                    <div>

                      <strong>
                        Upload Resume
                      </strong>

                      <small>
                        PDF only • Maximum 5 MB
                      </small>

                    </div>

                  </label>

                  <input
                    id="resume"
                    name="resume"
                    type="file"
                    accept="application/pdf,.pdf"
                    onChange={handleResumeChange}
                    required
                  />


                  {resumeName && (

                    <div className="file-name">
                      ✓ {resumeName}
                    </div>

                  )}


                  {resumeError && (

                    <div className="file-error">
                      {resumeError}
                    </div>

                  )}

                </div>

              </div>

            </div>


            <div className="submit-area">

              <button
                type="submit"
                disabled={loading}
              >

                {loading
                  ? "Submitting..."
                  : "Submit Application"}

              </button>

            </div>

          </form>

        </div>

      </main>


      <Footer />

    </div>
  );
}


/* ================= HEADER ================= */

function Header() {

  return (

    <header>

      <div className="logo">
        QMIZE
      </div>

      <div className="header-tag">
        Campus Recruitment
      </div>

    </header>
  );
}


/* ================= FOOTER ================= */

function Footer() {

  return (

    <footer>

      © 2026 GCE Gaya Campus Recruitment
      <br />

      Please ensure all information is accurate.

    </footer>
  );
}


/* ================= FORM FIELD ================= */

function FormField({
  label,
  name,
  type = "text",
  placeholder,
  maxLength,
  min,
  max,
  step,
  full = false
}) {

  return (

    <div
      className={`form-group ${
        full ? "full" : ""
      }`}
    >

      <label>
        {label} <span>*</span>
      </label>

      <input
        type={type}
        name={name}
        placeholder={placeholder}
        maxLength={maxLength}
        min={min}
        max={max}
        step={step}
        required
      />

    </div>
  );
}


export default App;
