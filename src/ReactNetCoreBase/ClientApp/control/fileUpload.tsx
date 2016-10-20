import * as React from 'react';
import { FormFieldProps, FormFieldState } from '../provider/formInterface';
import * as formatterSvc from '../service/formatter';
import { Field } from './field';
import IconButton from 'material-ui/IconButton';
import FlatButton from 'material-ui/FlatButton';
import Clear from 'material-ui/svg-icons/content/clear';
import Backup from 'material-ui/svg-icons/action/backup';

export interface FileUploadProps extends React.Props<FileUpload>, FormFieldProps {
  maxSize?: number;
  accepts?: string[];
  hintMessageNew?: string;
  hintMessageReplace?: string;
  returnBase64?: boolean;
  value?: any;
  existingImageUrl?: string;
  onFileLoaded?: { (file: File): void };
  style?: React.CSSProperties;
  height?: number;
}

interface FileUploadState extends FormFieldState {
  size: number;
  fileName: string;
  previewData: string;
  previewIcon: string;
  existingImageUrl: string;
}

export class FileUpload extends Field<FileUploadProps, FileUploadState, HTMLInputElement> {
  private fileInput: HTMLInputElement;
  static defaultProps = {
    hintMessageNew: "",
    hintMessageReplace:""
  }

  constructor(props: FileUploadProps, ctx) {
    super(props, ctx);
    this.state.size = 0;
    this.state.fileName = "";
    this.state.previewData = "";
    this.state.previewIcon = "";
    this.state.existingImageUrl = this.props.existingImageUrl;
  }

  handleFileChange(evt: React.FormEvent) {
    if (this.fileInput.files) {
      this.processFile(this.fileInput.files[0]);
    }
  }

  processFile(file: File) {
    const state = this.validateFile(file);
    const isValid = state["isValid"];
    var updateState = {
      size: isValid ? file.size : 0,
      fileName: file.name
    };
    if (!this.props.returnBase64) {
      updateState["value"] = isValid ? file.name : ""
    }
    if (isValid && this.props.onFileLoaded) {
      this.props.onFileLoaded(file);
    }
    this.setState(Object.assign(state, updateState), );
  }

  readFileContent(file: File, cb: { (base64content: string) }) {
    let fileReader = new FileReader();
    fileReader.addEventListener("load", () => {
      cb(fileReader.result);
    });
    fileReader.readAsDataURL(file);
  }

  private validateFile(file: File): any {
    let isValid = true;
    let result = {};
    let msgs = [];
    if (this.props.maxSize && file.size > this.props.maxSize) {
      isValid = false;
      msgs.push(this.i18n.t("validation:file_too_big", { size: formatterSvc.formatBytes(this.props.maxSize) } as any));
    }
    let exts = file.name.split('.');
    let ext = exts[exts.length - 1].toLowerCase();

    if (this.props.accepts) {
      isValid = this.props.accepts.filter(e => e.toLowerCase() === ext).length > 0;
      if (!isValid) {
        msgs.push(this.i18n.t("validation:not_allowed_extension", { ext: this.props.accepts.join(",") } as any));
      }
    }

    if (isValid) {
      // preview image
      if (["jpg", "jpeg", "bmp", "png", "gif"].indexOf(ext) >= 0) {
        this.readFileContent(file, (data) => {
          this.setState(Object.assign({}, this.state, {
            previewData: data,
            previewIcon: "",
            value: this.props.returnBase64 ? data : this.state.value
          }));
        });
      } else {
        if (this.props.returnBase64) {
          this.readFileContent(file, (data) => {
            this.setState(Object.assign({}, this.state, {
              value: data
            }));
          });
        }

        const dicts = {
          "fa-file-excel-o": "xlx_xlsx".split('_'),
          "fa-file-pdf-o": "pdf".split('_'),
          "fa-file-sound-o": "mp3_wav_ogg_ac3_acc".split('_'),
          "fa-file-word-o": "doc_docx".split('_'),
          "fa-file-archive-o": "zip_rar_7z_cab".split('_'),
          "fa-file-text-o": "txt_rtf_html".split('_'),
          "fa-file-powerpoint-o": "ppt_pptx".split('_')
        };
        let iconCss = "fa-file-o";
        Object.keys(dicts).forEach(k => {
          if (dicts[k].indexOf(ext) >= 0) {
            iconCss = k;
          }
        });
        result["previewIcon"] = "fa file-icon " + iconCss;
      }
    }

    return Object.assign(result, {
      isValid: isValid,
      isDirty: true,
      isTouched: true,
      errorText: msgs.map(m => <div key={m}>{m}</div>)
    });
  }

  private removeFile() {
    this.setState(Object.assign({}, this.state, {
      value: "",
      previewData: "",
      fileName: "",
      previewIcon: "",
      existingImageUrl: ""
    }), () => this.form.updateValueAndValidility(this));
  }

  private getHintLabel(): string {
    var msg = "";
    if (this.state.size)
      msg = formatterSvc.formatBytes(this.state.size);
    return this.state.fileName ? (this.state.fileName + " - " + msg) : "";
  }

  private containerDiv: HTMLDivElement;

  fileDragOver(e) {
    e.preventDefault();
    e.stopPropagation();
  }

  fileDrop(e: DragEvent) {
    this.fileDragOver(e);
    // fetch FileList object
    var files = e.dataTransfer.files;

    // process all File objects
    if (files && files.length === 1) {
      this.processFile(files[0]);
    }
  }

  componentDidMount() {
    if (this.containerDiv) {
      this.containerDiv.addEventListener("dragover", this.fileDragOver.bind(this), false);
      this.containerDiv.addEventListener("dragleave", this.fileDragOver.bind(this), false);
      this.containerDiv.addEventListener("drop", this.fileDrop.bind(this), false);
    }
  }

  componentWillUnMount() {
    if (this.containerDiv) {
      this.containerDiv.removeEventListener("dragover", this.fileDragOver.bind(this), false);
      this.containerDiv.removeEventListener("dragleave", this.fileDragOver.bind(this), false);
      this.containerDiv.removeEventListener("drop", this.fileDrop.bind(this), false);
    }
  }

  renderChild() {    
    return <div className={"file-upload-container " + (!this.props.height ? "inline" : "")}>
      <div className={"file-upload " + (this.state.previewData ? "has-file": "")} ref={(d) => { this.containerDiv = d } } style={{ height: this.props.height }}>
        <FlatButton onTouchTap={() => this.removeFile()} icon={<Clear/>}></FlatButton>
        <div className="info-wrapper">
          {this.state.previewData ? null : <Backup />}
          <div className="info">{this.getHintLabel()}</div>
          <div className="error">{this.getErrorElement()}</div>
        </div>
        <input type="file" className="file" onChange={this.handleFileChange.bind(this)} ref={(ip) => this.fileInput = ip}/>
        {this.state.previewData || this.state.existingImageUrl ? <img className="preview-img" src={this.state.previewData || this.state.existingImageUrl} /> : null}        
        <div className="preview-container">
          <div className="preview">
            <div className="file-info">{this.getHintLabel()}</div>
            <div className="info">{this.props.hintMessageReplace}</div>
            <div className="error">{this.getErrorElement()}</div>
          </div>
        </div>
      </div>
    </div>
  }
}