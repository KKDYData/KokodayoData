// This file is created by quicktype-core
// Do not modify this file!!!!!!!!!
// 使用 quicktype 生成的类型，不要乱改！

export interface IDict {
    wordkeys: string[];
    charId:   string;
    dict:     Dict;
}

export interface Dict {
    JP?:          CNMandarin;
    CN_MANDARIN?: CNMandarin;
    LINKAGE?:     CNMandarin;
    CN_TOPOLECT?: CNMandarin;
}

export interface CNMandarin {
    wordkey:       string;
    voiceLangType: VoiceLangType;
    cvName:        string;
    voicePath?:    string;
}

export enum VoiceLangType {
    CNMandarin = "CN_MANDARIN",
    CNTopolect = "CN_TOPOLECT",
    Jp = "JP",
    Linkage = "LINKAGE",
}
