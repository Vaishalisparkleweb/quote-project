const nodemailer = require('nodemailer');
const { sendConfirmationEmail, sendResetPasswordEmail } = require('./emailService');

jest.mock('nodemailer');

  

describe('Email Service', () => {
  let sendMailMock;

  beforeAll(() => {
    sendMailMock = jest.fn().mockResolvedValue('Email sent');
    nodemailer.createTransport.mockReturnValue({ sendMail: sendMailMock });
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('sendConfirmationEmail', () => {
    test('should send confirmation email successfully', async () => {
      const email = 'test@example.com';
      const token = 'testtoken';

      await sendConfirmationEmail(email, token);

      expect(sendMailMock).toHaveBeenCalledTimes(1);
      expect(sendMailMock).toHaveBeenCalledWith({
        from: process.env.MAIL_USER,
        to: email,
        subject: 'Registration Successful - Confirm Your Email',
        html: expect.stringContaining('Confirm Email'),
      });
    });

    test('should handle errors when sending confirmation email', async () => {
      sendMailMock.mockRejectedValueOnce(new Error('Failed to send email'));

      const email = 'test@example.com';
      const token = 'testtoken';

      await expect(sendConfirmationEmail(email, token)).rejects.toThrow('Failed to send email');
    });
  });

  describe('sendResetPasswordEmail', () => {
    test('should send reset password email successfully', async () => {
      const email = 'test@example.com';
      const token = 'testtoken';

      await sendResetPasswordEmail(email, token);

      expect(sendMailMock).toHaveBeenCalledTimes(1);
      expect(sendMailMock).toHaveBeenCalledWith({
        from: process.env.MAIL_USER,
        to: email,
        subject: 'Password Reset Requested',
        html: expect.stringContaining('Reset Password'),
      });
    });

    test('should handle errors when sending reset password email', async () => {
      sendMailMock.mockRejectedValueOnce(new Error('Failed to send email'));

      const email = 'test@example.com';
      const token = 'testtoken';

      await expect(sendResetPasswordEmail(email, token)).rejects.toThrow('Failed to send email');
    });
  });
});