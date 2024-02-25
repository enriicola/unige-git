export interface Document {
    data: DocumentData;
    size?: number;
    file?: File;
    copy?: boolean;
}

export interface DocumentData {
    id?: number;
    description?: string;
    name: string;
    path?: string;
    documentalLink?: string;
    type?: DocumentType;
    category?: DocumentCategory;
    // status?: Status;
    statusText?: string;
    insertDate?: Date;
    referenceDate?: Date;
    deliveryDate?: Date;
    externalCode?: string;
    internalCode?: number;
    // insertUser?: User;
    // owner?: User;
    revision?: string;
    idProject: number;
    assigned?: boolean;
    touched?: boolean;
    // activities?: Activity[];
    assignedToActivitiesText?: string;
    remarksTotal?: number;
    // docIspStatus?: DocIspStatus[];
    // docStatusUnion?: Status;
    docStatusUnionText?: string;
    remarks?: Remark[];
    isSon: boolean;
    fathersDocumentsId?: number[];
    sonsDocumentsId?: number[];
    isFirstDelivery?: boolean;
    isExcluded: boolean;
    isInhibited: boolean;
    comment?: string;
    private?: boolean;
    fullCode?: string;
    nameCode?: string;
    replacedDocs?: DocumentData[];
}

export interface DocumentType {
    id: number;
}

export interface DocumentCategory {
    id: number;
    code: string;
}

export interface Remark {
    id?: number;
    title: string;
    description: string;
    // user?: User;
    // creator?: User;
    // status?: Status;
    // type: RemarkType;
    insertDate?: Date;
    lastChangeDate?: Date;
    idProject: number;
    progressive?: number;
    normativeReference: string;
    isEdited?: boolean;
    isDeleted?: boolean;
    isInsertNotIsp?: boolean;
    activityDocumentRemark: {
        idActivity: number;
        idDocument?: number;
        idRemark?: number;
    };
    // reply?: Reply;
    replyMess?: string;
    replyMessConfirm?: boolean;
    contradictoryMess?: string;
    contradictoryProposal?: string;
    resultMess?: string;
    // activity?: Activity;
    fullName?: string;
    code?: string;
    resultReply?: string;
    resultContradictory?: string;
    result?: string;
    fatherId?: number;
    imageLink?: string;
    imageName?: string;
    image?: File;
    delegate?: string;
}
