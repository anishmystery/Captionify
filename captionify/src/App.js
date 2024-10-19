import {
  Typography,
  Box,
  Button,
  TextField,
  Select,
  FormControl,
  MenuItem,
  InputLabel,
  FormControlLabel,
  Switch,
  CircularProgress,
} from "@mui/material";
import { AutoAwesome, Close, Upload } from "@mui/icons-material";
import { forwardRef, useEffect, useRef, useState } from "react";
import axios from "axios";
import logo from "./assets/captionify.png";

function App() {
  const [captionLoading, setCaptionLoading] = useState(false);
  const [captions, setCaptions] = useState([]);
  const captionListRef = useRef(null);

  useEffect(() => {
    if (captions.length > 0 && captionListRef.current) {
      captionListRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [captions]);

  return (
    <Box sx={{ padding: "16px" }}>
      <Header></Header>
      <CaptionifyLogic
        setCaptionLoading={setCaptionLoading}
        setCaptions={(newCaptions) => {
          setCaptions(newCaptions);
          if (captionListRef.current) {
            captionListRef.current.scrollIntoView({ behavior: "smooth" });
          }
        }}
      ></CaptionifyLogic>
      {captionLoading ? (
        <Box
          sx={{ marginTop: "32px", display: "flex", justifyContent: "center" }}
        >
          <CircularProgress></CircularProgress>
        </Box>
      ) : (
        <CaptionList captions={captions} ref={captionListRef}></CaptionList>
      )}
    </Box>
  );
}

function Header() {
  return (
    <Box sx={{ textAlign: "center", padding: "32px" }}>
      <Box sx={{ display: "flex", justifyContent: "center", gap: "5px" }}>
        <img src={logo} alt="logo-image" height="60px"></img>
        <Typography
          variant="h3"
          style={{
            fontFamily: "Playwrite GB S",
            fontWeight: "350",
            lineHeight: "1",
            fontSize: "2.75rem",
            color: "#1565c0",
          }}
        >
          captionify
        </Typography>
      </Box>
      <Typography variant="h6" marginTop="16px">
        Enhance your photos with AI-crafted captions that align with your
        desired mood and style.
      </Typography>
      <Typography variant="h6" gutterBottom>
        From witty remarks to heartfelt expressions, every snap gets the perfect
        words!
      </Typography>
    </Box>
  );
}

function CaptionifyLogic({ setCaptionLoading, setCaptions }) {
  const [previewImage, setPreviewImage] = useState(null);
  const [description, setDescription] = useState("");
  const [tone, setTone] = useState("Happy");
  const [writingStyle, setWritingStyle] = useState("Casual");
  const [additionalContext, setAdditionalContext] = useState("");
  const [includeEmojis, setIncludeEmojis] = useState(true);
  const [includeHashtags, setIncludeHashtags] = useState(true);
  const [imageLoading, setImageLoading] = useState(false);
  const [error, setError] = useState("");
  const [validationMessage, setValidationMessage] = useState("");
  const [fileSize, setFileSize] = useState("JPG, PNG files less than 10MB");

  function handleChangeDescription(e) {
    setDescription(e.target.value);
  }

  function handleChangeTone(e) {
    setTone(e.target.value);
  }

  function handleChangeWritingStyle(e) {
    setWritingStyle(e.target.value);
  }

  function handleChangeAdditionalContext(e) {
    setAdditionalContext(e.target.value);
  }

  function handleToggleIncludeEmojis() {
    setIncludeEmojis((addEmojis) => !addEmojis);
  }

  function handleToggelIncludeHashtags() {
    setIncludeHashtags((addHashtags) => !addHashtags);
  }

  function handleClickClose() {
    setPreviewImage(null);
    setDescription("");
    setTone("Happy");
    setWritingStyle("Casual");
    setAdditionalContext("");
    setIncludeEmojis(true);
    setIncludeHashtags(true);
    setCaptions([]);
  }

  async function handleImageUpload(e) {
    setFileSize("JPG, PNG files less than 10MB");
    const file = e.target.files[0];
    if (file && file.size / (1024 * 1024) < 10) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64String = reader.result;
        try {
          setImageLoading(true);
          const response = await axios.post(
            "http://127.0.0.1:8000/api/description",
            {
              image: base64String,
            }
          );
          setDescription(response.data);
          setPreviewImage(base64String);
        } catch (err) {
          if (err.response) {
            setCaptionLoading(false);
            // Server-side error (FastAPI returned an error)
            console.error("Server Error:", err.response.data.detail);
          } else if (err.request) {
            // No response was received
            console.error(
              "Network Error: No response from server",
              err.request
            );
          } else {
            // Other client-side errors
            console.error("Error:", err.message);
          }
        } finally {
          setImageLoading(false);
        }
      };
      reader.readAsDataURL(file);
    } else {
      setFileSize("File is exceeding the size limit");
    }
  }

  async function handleFormSubmit(e) {
    e.preventDefault();
    if (!description) {
      setValidationMessage("Description is required");
      return;
    }
    setCaptionLoading(true);
    try {
      const response = await axios.post("http://127.0.0.1:8000/api/caption", {
        description,
        tone,
        style: writingStyle,
        additionalContext: additionalContext ? additionalContext : null,
        emojis: includeEmojis ? "Yes" : "No",
        hashtags: includeHashtags ? "Yes" : "No",
      });
      setCaptionLoading(false);
      setCaptions(JSON.parse(response.data).captions);
    } catch (err) {
      setCaptionLoading(false);
      if (err.response) {
        // Server-side error (FastAPI returned an error)
        console.error("Server Error:", err.response.data.detail);
        setError(
          "Server Error: Unable to generate captions. Please try again!"
        );
      } else if (err.request) {
        // No response was received
        console.error("Network Error: No response from server", err.request);
        setError("Network Error: No response from server. Please try again!");
      } else {
        // Other client-side errors
        console.error("Error:", err.message);
        setError(
          "Client Error: Unable to generate captions. Please try again!"
        );
      }
    }
  }
  return (
    <>
      <Box
        sx={{
          marginTop: "16px",
          padding: "16px",
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-evenly",
          borderRadius: "8px",
          gap: "16px",
          flexDirection: { xs: "column", sm: "row" },
        }}
      >
        {!previewImage ? (
          <Box
            sx={{
              padding: "16px",
              flex: 1,
              border: "2px dashed black",
              borderRadius: "8px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              textAlign: "center",
              height: "335px",
            }}
          >
            {imageLoading ? (
              <Box sx={{ alignSelf: "center" }}>
                <CircularProgress size="3rem"></CircularProgress>
              </Box>
            ) : (
              <>
                <Box sx={{ alignSelf: "center" }}>
                  <Button
                    component="label"
                    size="large"
                    startIcon={<Upload></Upload>}
                  >
                    Upload Image
                    <input
                      type="file"
                      style={{ display: "none" }}
                      onChange={handleImageUpload}
                      accept="image/png, image/jpeg"
                    ></input>
                  </Button>
                </Box>
                <Typography
                  variant="subtitle2"
                  color="textDisabled"
                  marginTop="16px"
                >
                  {fileSize}
                </Typography>
              </>
            )}
          </Box>
        ) : (
          <Box
            sx={{
              padding: "16px",
              flex: 1,
              display: "flex",
              border: "2px dashed black",
              borderRadius: "8px",
              overflow: "hidden",
              justifyContent: "center",
              alignContent: "center",
              height: { xs: "250px", sm: "335px" },
              position: "relative",
            }}
          >
            <img
              src={previewImage}
              alt="uploaded-image"
              style={{
                maxWidth: "100%",
                maxHeight: "100%",
                objectFit: "contain",
              }}
            ></img>
            <Close
              className="close-btn"
              sx={{ position: "absolute", right: "16px" }}
              onClick={handleClickClose}
            ></Close>
          </Box>
        )}
        <Box sx={{ padding: "8px", flex: 1 }}>
          <TextField
            size="small"
            label="Description"
            variant="outlined"
            placeholder="Brief description of the image"
            multiline
            rows={3}
            fullWidth
            value={description}
            onChange={handleChangeDescription}
            error={!!validationMessage}
            helperText={validationMessage}
          ></TextField>
          <FormControl
            size="small"
            margin="normal"
            variant="outlined"
            fullWidth
          >
            <InputLabel id="tone-label">Tone</InputLabel>
            <Select
              labelId="tone-label"
              label="Tone"
              value={tone}
              onChange={handleChangeTone}
            >
              <MenuItem value="Happy">Happy</MenuItem>
              <MenuItem value="Excited">Excited</MenuItem>
              <MenuItem value="Funny">Funny</MenuItem>
              <MenuItem value="Sarcastic">Sarcastic</MenuItem>
              <MenuItem value="Professional">Professional</MenuItem>
              <MenuItem value="Sad">Sad</MenuItem>
              <MenuItem value="Inspiring">Inspiring</MenuItem>
              <MenuItem value="Calm">Calm</MenuItem>
              <MenuItem value="Witty">Witty</MenuItem>
              <MenuItem value="Nostalgic">Nostalgic</MenuItem>
            </Select>
          </FormControl>
          <FormControl
            size="small"
            margin="normal"
            variant="outlined"
            fullWidth
          >
            <InputLabel id="writing-style-label">Writing Style</InputLabel>
            <Select
              labelId="writing-style-label"
              label="Writing Style"
              value={writingStyle}
              onChange={handleChangeWritingStyle}
            >
              <MenuItem value="Casual">Casual</MenuItem>
              <MenuItem value="Formal">Formal</MenuItem>
              <MenuItem value="Poetic">Poetic</MenuItem>
              <MenuItem value="Narrative">Narrative</MenuItem>
              <MenuItem value="Conversational">Conversational</MenuItem>
              <MenuItem value="Persuasive">Persuasive</MenuItem>
            </Select>
          </FormControl>
          <TextField
            size="small"
            margin="normal"
            fullWidth
            multiline
            rows={3}
            label="Additional Context"
            placeholder="Additional context about the image (e.g., location, event, etc.) that could influence the caption"
            value={additionalContext}
            onChange={handleChangeAdditionalContext}
          ></TextField>
          <FormControlLabel
            control={
              <Switch
                checked={includeEmojis}
                onChange={handleToggleIncludeEmojis}
              ></Switch>
            }
            label="Include emojis"
          ></FormControlLabel>
          <FormControlLabel
            control={
              <Switch
                checked={includeHashtags}
                onChange={handleToggelIncludeHashtags}
              ></Switch>
            }
            label="Include hashtags"
          ></FormControlLabel>
        </Box>
      </Box>
      <Box sx={{ padding: "0 16px" }}>
        <Button
          type="submit"
          variant="contained"
          sx={{ marginTop: "16px" }}
          fullWidth
          startIcon={<AutoAwesome></AutoAwesome>}
          onClick={handleFormSubmit}
        >
          Generate
        </Button>
        <Typography variant="subtitle1" color="error" sx={{ marginTop: "8px" }}>
          {error}
        </Typography>
      </Box>
    </>
  );
}

const CaptionList = forwardRef(({ captions }, ref) => {
  return (
    <Box sx={{ padding: "16px" }} ref={ref}>
      {captions.map((caption, index) => (
        <Caption key={index} caption={caption} index={index}></Caption>
      ))}
    </Box>
  );
});

function Caption({ caption, index }) {
  return (
    <Typography variant="body1" marginTop="16px" gutterBottom>
      {`${index + 1}. ${caption}`}
    </Typography>
  );
}

export default App;
