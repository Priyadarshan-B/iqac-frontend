import React, { useState } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import NotificationsIcon from '@mui/icons-material/Notifications';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';

const notificationStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 300,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: 1,
};

const iconStyle = {
  position: 'absolute',
  top: 20, // Adjust to position the icon higher
  right: 20, // Float to the right
  backgroundColor: 'skyblue',
  borderRadius: '50%',

};

function FacultyPage() {
  const [open, setOpen] = useState(false);
  const notifications = [
    "Course Engineering Mathematics updated.",
    "New student added to Data Structures.",
    "Digital Electronics syllabus published."
  ];

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const courses = [
    {
      courseName: "Engineering Mathematics",
      courseCode: "22MA202",
      totalPaper: 200,
      department: "AIML",
      venue: "WW208"
    },
    {
      courseName: "Data Structures",
      courseCode: "22CS101",
      totalPaper: 150,
      department: "CSE",
      venue: "LW303"
    },
    {
      courseName: "Digital Electronics",
      courseCode: "22EC102",
      totalPaper: 180,
      department: "ECE",
      venue: "EE104"
    }
  ];

  return (
    <Container sx={{ padding: '20px', position: 'relative' }}>
      {/* Notification Icon */}
      <Box sx={iconStyle}>
        <IconButton 
          aria-label="notifications" 
          onClick={handleOpen}
          sx={{ color: 'yellow' }} // Change icon color to yellow
        >
          <Badge badgeContent={notifications.length} color="primary">
            <NotificationsIcon />
          </Badge>
        </IconButton>
      </Box>

      {/* Notification Modal */}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="notification-modal-title"
        aria-describedby="notification-modal-description"
      >
        <Box sx={notificationStyle}>
          <Typography id="notification-modal-title" variant="h6" component="h2">
            Notifications
          </Typography>
          <Box sx={{ marginTop: 2 }}>
            {notifications.map((notification, index) => (
              <Typography key={index} variant="body2">
                {notification}
              </Typography>
            ))}
          </Box>
        </Box>
      </Modal>

      <Grid container spacing={2} sx={{ marginTop: '40px' }}>
        {courses.map((course, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card sx={{ minWidth: 275 }}>
              <CardContent>
                <Typography variant="h5" component="div" gutterBottom>
                  {course.courseName}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>Course Code:</strong> {course.courseCode}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>Total Paper:</strong> {course.totalPaper}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>Department:</strong> {course.department}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>Venue:</strong> {course.venue}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

export default FacultyPage;
