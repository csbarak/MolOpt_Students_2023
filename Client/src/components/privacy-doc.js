import React from 'react'

import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material'

const PrivacyDoc = ({ value, setValue }) => {
  return (
    <div>
      <Dialog
        open={value}
        scroll='paper'
        aria-labelledby='scroll-dialog-title'
        aria-describedby='scroll-dialog-description'
      >
        <DialogTitle id='scroll-dialog-title'>Privacy Policy</DialogTitle>
        <DialogContent dividers={true}>
          <DialogContentText id='scroll-dialog-description' tabIndex={-1}>
            At Molopt, we are committed to protecting the privacy of our customers and users of our website. This
            privacy policy outlines the information we collect, how we use it, and how we protect it. By using our
            website, you acknowledge and accept the practices outlined in this privacy policy. Information We Collect:
            We may collect personal information, such as your name, email address, and phone number, when you create an
            account with us or sign up for our newsletter. We may also collect information about your location, IP
            address, and browsing history when you use our website. Use of Information: We may use the information we
            collect to personalize your experience on our website, to communicate with you, to process orders and
            transactions, and for marketing and research purposes. We may also share this information with third parties
            for these purposes. Protection of Information: We take the protection of your personal information seriously
            and have implemented measures to secure it. However, please note that no method of electronic transmission
            or storage is completely secure, and we cannot guarantee the absolute security of your information. Terms of
            Use: By using our website, you agree to the following terms of use: You will not use our website for any
            illegal or unauthorized purpose. You will not engage in any activity that could damage, disable, or
            overburden our website. You will not attempt to gain unauthorized access to our website or any accounts,
            systems, or networks associated with our website. You will not use our website to transmit any viruses,
            worms, or other malicious code. You will not use our website to infringe upon the rights of others,
            including but not limited to intellectual property rights. We reserve the right to modify these terms of use
            at any time. It is your responsibility to review these terms regularly and to cease use of our website if
            you do not agree to the modified terms. or unauthorized purpose. You will not engage in any activity that
            could damage, disable, or overburden our website. You will not attempt to gain unauthorized access to our
            website or any accounts, systems, or networks associated with our website. You will not use our website to
            transmit any viruses, worms, or other malicious code. You will not use our website to infringe upon the
            rights of others, including but not limited to intellectual property rights. We reserve the right to modify
            these terms of use at any time. It is your responsibility to review these terms regularly and to cease use
            of our website if you do not agree to the modified terms. or unauthorized purpose. You will not engage in
            any activity that could damage, disable, or overburden our website. You will not attempt to gain
            unauthorized access to our website or any accounts, systems, or networks associated with our website. You
            will not use our website to transmit any viruses, worms, or other malicious code. You will not use our
            website to infringe upon the rights of others, including but not limited to intellectual property rights. We
            reserve the right to modify these terms of use at any time. It is your responsibility to review these terms
            regularly and to cease use of our website if you do not agree to the modified terms.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={e => setValue(false)} sx={{ mt: 2 }}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default PrivacyDoc
