import TextField from "@mui/material/TextField"
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs"
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker"
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider"
import { useContext } from "react"
import { MainContext } from "src/context/MainContext"

const popperSx = {
  "& .MuiPaper-root": {
    border: "1px solid #322F33",
    padding: 0,
    marginTop: 1,
    backgroundColor: "#0E0A0F",
    color: "white",
    borderRadius: "10px"
  },
  "& .MuiCalendarPicker-root": {
    backgroundColor: "#0E0A0F",
    color: "white",
    borderRadius: "10px"
  },
  "& .MuiButtonBase-root": {
    color: "white"
  },
  "& .MuiButtonBase-root:hover": {
    color: "#0E0A0F",
    backgroundColor: "white",
    "& .MuiTypography-root": {
      color: "#0E0A0F"
    }
  },
  "& .MuiTypography-root": {
    color: "white"
  },
  "& .PrivatePickersSlideTransition-root": {},
  "& .MuiPickersDay-dayWithMargin": {
    color: "white",
    backgroundColor: "#0E0A0F"
  },
  "& .MuiPickersDay-today": {
    borderColor: "white !important"
  },
  "& .MuiTabs-root": { backgroundColor: "rgba(120, 120, 120, 0.4)" },
  "& .css-1flhz3h": {
    color: "white"
  },
  "& .css-l0iinn": {
    padding: "20px 0px",
    minWidth: "210px"
  }
}

const inputSx = {
  width: "20px",
  height: "22px",
  "& .MuiSvgIcon-root": {
    color: "#BF7AF0"
  },
  "& .MuiInputBase-input": {
    backgroundColor: "transparent"
  },
  "& .MuiButtonBase-root": {
    marginLeft: "-42px"
  }
}

export const DateAndTimePicker = () => {
  const { postTime, setPostTime } = useContext(MainContext)
  const handleChange = (newValue: any) => {
    setPostTime(newValue)
  }

  return (
    <>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DateTimePicker
          value={postTime}
          onChange={handleChange}
          renderInput={(params) => <TextField {...params} />}
          PopperProps={{
            sx: popperSx
          }}
          InputProps={{
            sx: inputSx
          }}
          ampmInClock={false}
          disablePast={true}
          desktopModeMediaQuery={"@media screen and (min-width: 100px)"}
        />
      </LocalizationProvider>
    </>
  )
}
