// FeedbackModal.jsx

import React from "react";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from "@mui/material";

import { useForm } from "react-hook-form";

import { toast } from "react-toastify";

import { addTestimonial } from "../../services/review";

function FeedbackModal({ open, handleClose }) {

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: {
      errors,
      isSubmitting,
    },
  } = useForm();

  const feedbackValue = watch(
    "description",
    ""
  );

  const wordCount = feedbackValue.trim()
    ? feedbackValue.trim().split(/\s+/).length
    : 0;

  const onSubmit = async (data) => {

    try {

      await addTestimonial(data);

      toast.success(
        "Feedback submitted successfully ❤️"
      );

      reset();

      handleClose();

    } catch (error) {

      toast.error(
        "Failed to submit feedback"
      );
    }
  };

  return (

    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="sm"
    >

      {/* Header */}
      <DialogTitle
        sx={{
          fontWeight: 700,
          fontSize: "24px",
          paddingBottom: "4px",
        }}
      >
        Share Your Feedback
      </DialogTitle>

      {/* Subtitle */}
      <div className="px-6 pb-2">

        <p className="text-sm text-gray-600 leading-relaxed">
          आपका feedback हमारे platform को बेहतर बनाने में मदद करता है।
        </p>

        <p className="text-xs text-gray-400 mt-1">
          Minimum 10 words • Maximum 500 words
        </p>

      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)}>

        <DialogContent sx={{ paddingTop: "10px" }}>

          <TextField
            fullWidth
            multiline
            rows={5}
            placeholder="Write your honest feedback here..."
            error={!!errors.description}
            helperText={
              errors.description?.message
            }
            {...register("description", {

              required: "Feedback is required",

              validate: (value) => {

                const words = value
                  .trim()
                  .split(/\s+/);

                if (words.length < 5) {
                  return "Minimum 5 words required";
                }

                if (words.length > 500) {
                  return "Maximum 500 words allowed";
                }

                return true;
              },
            })}
          />

          {/* Counter */}
          <div className="flex justify-between mt-2">

            <p className="text-xs text-gray-400">
              {wordCount}/500 words
            </p>

            {wordCount > 500 && (
              <p className="text-xs text-red-500">
                Word limit exceeded
              </p>
            )}

          </div>

        </DialogContent>

        {/* Footer */}
        <DialogActions
          sx={{
            paddingX: "24px",
            paddingBottom: "24px",
          }}
        >

          <Button
            onClick={handleClose}
            variant="outlined"
            color="inherit"
          >
            Cancel
          </Button>

          <Button
            type="submit"
            variant="contained"
            disabled={isSubmitting}
            sx={{
              backgroundColor: "#d97706",
              "&:hover": {
                backgroundColor: "#b45309",
              },
              textTransform: "none",
              borderRadius: "10px",
              paddingX: "20px",
            }}
          >
            {isSubmitting
              ? "Submitting..."
              : "Submit Feedback"}
          </Button>

        </DialogActions>

      </form>

    </Dialog>
  );
}

export default FeedbackModal;