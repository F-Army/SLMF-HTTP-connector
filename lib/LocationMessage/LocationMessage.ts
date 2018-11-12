import Joi from "joi";
import xml2js from "xml2js";
import { bytesMaxValue, removeUndefinedProperties } from "./../utils";

const eightBytesMaxValue = bytesMaxValue(8);
const OneHundredTwentyThreeBytesMaxValue = bytesMaxValue(123);

export enum BatteryStatus {
    Good,
    ReplacementRequired,
    Unknown = 3,
}

export enum TagIdFormat {
    ISO_IEC_15963 = 1,
    IEEE_EUI_48,
    IEEE_EUI_64,
}

interface IPoint {
    x: number;
    y: number;
    z: number;
}

interface ILocationData {
    source: string;
    format: string;
    tagIdFormat: TagIdFormat;
    tagId: number;
    position: IPoint;
    battery: BatteryStatus;
    timestamp: Date;
    classification?: string;
    zone?: string;
    exciterId?: string;
    antennaId?: number;
    data?: number;
    algorithm?: string;
}

interface ILocationDataXML {
    src: string;
    fmt: string;
    idfmt: TagIdFormat;
    tid: number;
    x: number;
    y: number;
    z: number;
    bat: number;
    t: string;
    cls?: string;
    zon?: string;
    exc?: string;
    ant?: number;
    dat?: number;
    alg?: string;
}

/* tslint:disable:object-literal-sort-keys */
const schema = Joi.object().keys({
    source: Joi.string().min(1).max(64).required(),
    format: Joi.string().min(1).max(64).required(),
    tagIdFormat: Joi.number().only(1, 2, 3).required(),
    tagId: Joi.number().min(0).max(eightBytesMaxValue).required(),
    position: Joi.object({
        x: Joi.number().required(),
        y: Joi.number().required(),
        z: Joi.number().required(),
    }),
    battery: Joi.number().only(0, 1, 3).required(),
    timestamp: Joi.date().required(),
    classification: Joi.string().min(1).max(256),
    zone: Joi.string().min(1).max(256),
    exciterId: Joi.string().min(1).max(64),
    antennaId: Joi.number().min(0).max(255),
    data: Joi.number().min(0).max(OneHundredTwentyThreeBytesMaxValue),
    algorithm: Joi.string().min(1).max(64),
});
/* tslint:enable:object-literal-sort-keys */

class LocationMessage {
    private data$!: ILocationData;

    constructor(data: ILocationData) {
        this.data = data;
    }

    set data(data: ILocationData) {
        const validation = Joi.validate(data, schema);

        if (validation.error) {
            throw new Error("Invalid location data");
        }

        this.data$ = validation.value;
    }

    get data() { return this.data$; }

    public toXML(): string {
        /* tslint:disable:object-literal-sort-keys */

        const xmlObject: ILocationDataXML = {
            src: this.data.source,
            fmt: this.data.format,
            idfmt: this.data.tagIdFormat,
            tid: this.data.tagId,
            x: this.data.position.x,
            y: this.data.position.y,
            z: this.data.position.z,
            bat: this.data.battery,
            t: this.data.timestamp.toISOString(),
            cls: this.data.classification,
            zon: this.data.zone,
            exc: this.data.exciterId,
            ant: this.data.antennaId,
            dat: this.data.data,
            alg: this.data.algorithm,
        };

        // Remove properties that are undefined to not store them in the xml
        removeUndefinedProperties(xmlObject);

        /* tslint:enable:object-literal-sort-keys */
        const builder = new xml2js.Builder({rootName: "SLMF", headless: true});
        return builder.buildObject(xmlObject);
    }
}

export default LocationMessage;
