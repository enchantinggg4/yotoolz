import * as React from "react";
import { formatAmount } from "src/utils/format";
import Status from "src/components/Status";

import { css } from "aphrodite";
import styles from "./AmountBot.styles";
import {
  Button,
  Card,
  CardContent,
  Divider,
  FormControl,
  FormGroup,
  FormHelperText,
  TextField,
  Typography,
  InputAdornment
} from "@material-ui/core";

interface IAmountBotProps {
  product: { base: string; quote: string };

  enabled: boolean;
  delay: number;
  priceDangerousZone: number;
  priceAmountZone: number;
  maxBaseVolume: number;
  maxQuoteVolume: number;
  sizeMin: number;
  sizeMax: number;

  isDevMode: boolean;
  updateBotConfig: (name: string, value: any) => void;
}

export default class AmountBot extends React.Component<IAmountBotProps, any> {
  public render() {
    const {
      isDevMode,
      enabled,
      delay,
      priceDangerousZone,
      priceAmountZone,
      maxBaseVolume,
      maxQuoteVolume,
      sizeMin,
      sizeMax
    } = this.props;

    return (
      <Card className={css(styles.Bot)}>
        <CardContent>
          <Typography
            gutterBottom={true}
            variant="h5"
            component="div"
            className={css(styles.BotTitle)}
            color="textPrimary"
          >
            Amount BOT&nbsp;
            <Status isActive={enabled} />
            <Button
              variant="contained"
              className={css(styles.TurnOn)}
              color={!enabled ? "primary" : "default"}
              onClick={() => this.handleFieldChange("enabled")(!enabled)}
            >
              {enabled ? "Выкл" : "Вкл"}
            </Button>
          </Typography>

          <Divider />

          <FormGroup>
            <form
              className={css(styles.Form)}
              noValidate={true}
              autoComplete="off"
            >
              <FormControl>
                <TextField
                  label="delay"
                  value={delay}
                  onChange={this.handleFieldChange("delay", "int")}
                  margin="normal"
                />
                <FormHelperText focused={true}>
                  Пауза между ордерами (сек.)
                </FormHelperText>
              </FormControl>

              <FormControl>
                <TextField
                  label="maxBaseVolume"
                  value={maxBaseVolume}
                  onChange={this.handleFieldChange("maxBaseVolume", "number")}
                  margin="normal"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        {this.props.product.base}
                      </InputAdornment>
                    )
                  }}
                />
                <FormHelperText focused={true}>Объем</FormHelperText>
              </FormControl>

              <FormControl>
                <TextField
                  label="maxQuoteVolume"
                  value={maxQuoteVolume}
                  onChange={this.handleFieldChange("maxQuoteVolume", "number")}
                  margin="normal"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        {this.props.product.quote}
                      </InputAdornment>
                    )
                  }}
                />
                <FormHelperText focused={true}>Объем</FormHelperText>
              </FormControl>

              <div className={css(styles.inRow)}>
                <FormControl className={css(styles.FieldInRow)}>
                  <TextField
                    label="sizeMin"
                    value={sizeMin}
                    onChange={this.handleFieldChange("sizeMin", "number")}
                    margin="normal"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          {this.props.product.base}
                        </InputAdornment>
                      )
                    }}
                  />
                  <FormHelperText focused={true}>
                    Min объем ордера
                  </FormHelperText>
                </FormControl>

                <FormControl className={css(styles.FieldInRow)}>
                  <TextField
                    label="sizeMax"
                    value={sizeMax}
                    onChange={this.handleFieldChange("sizeMax", "number")}
                    margin="normal"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          {this.props.product.base}
                        </InputAdornment>
                      )
                    }}
                  />
                  <FormHelperText focused={true}>
                    Max объем ордера
                  </FormHelperText>
                </FormControl>
              </div>

              {isDevMode && (
                <FormControl>
                  <TextField
                    label="priceDangerousZone"
                    value={priceDangerousZone}
                    onChange={this.handleFieldChange(
                      "priceDangerousZone",
                      "number"
                    )}
                    margin="normal"
                  />
                  <FormHelperText focused={true}>Опасная зона</FormHelperText>
                </FormControl>
              )}

              {isDevMode && (
                <FormControl>
                  <TextField
                    label="priceAmountZone"
                    value={priceAmountZone}
                    onChange={this.handleFieldChange(
                      "priceAmountZone",
                      "number"
                    )}
                    margin="normal"
                  />
                  <FormHelperText focused={true}>
                    Зона выставления ордеров
                  </FormHelperText>
                </FormControl>
              )}
            </form>
          </FormGroup>
        </CardContent>
      </Card>
    );
  }

  private handleFieldChange = (name: string, type: string = "any") => (
    event: any
  ) => {
    let value = event && event.target && event.target.value || event;

    if (type == "number") value = formatAmount(value);
    if (type == "int") {
      value = parseInt(value);
      if (isNaN(value)) value = "";
    }

    this.props.updateBotConfig(name, value);
  };
}
