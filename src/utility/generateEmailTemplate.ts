export const generateEmailTemplate = (url: string) => {
  const template = `<!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8" />
            <title>Email Verification</title>
            <style>
                .email-container {
                    font-family: sans-serif;
                    line-height: 1.6;
                    color: #333;
                    max-width: 600px;
                    margin: 20px auto;
                    padding: 20px;
                    border: 1px solid #ddd;
                    border-radius: 5px;
                }
                .verification-button {
                    display: inline-block;
                    padding: 10px 20px;
                    background-color: #007bff;
                    color: #ffffff;
                    text-decoration: none;
                    border-radius: 5px;
                    margin-top: 15px;
                }
            </style>
        </head>
        <body>
            <div class="email-container">
                <h1>Verify Your Email Address</h1>
                <p>Hi there,</p>
                <p>Thank you for signing up! Please click the button below to verify your email address and activate your account:</p>
                
                <a href="${url}" style="color: white; class="verification-button">Verify Email</a>
                
                <p>If the button above does not work, please copy and paste the following link into your web browser:</p>
                <p>
                    <a href="${url}">${url}</a>
                </p>
                <p>Thanks,<br>Your Team</p>
            </div>
        </body>
        </html>`;
  return template;
};
