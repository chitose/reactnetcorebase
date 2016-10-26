import * as React from 'react';
import { FormFieldProps, FormFieldState } from '../provider/formInterface';
import { Field } from './field';

// source from : https://github.com/JeremyFagis/dropify
type DropifyAllowedFormat = 'portrait' | 'square' | 'landscape';
type DropifyMessage = {
  default?: string;
  replace?: string;
  remove?: string;
  error?: string;
};
type DropifyErrorMessage = {
  fileSize?: string;
  minWidth?: string;
  maxWidth?: string;
  minHeight?: string;
  maxHeight?: string;
  imageFormat?: string;
  fileExtension?: string;
};
type DropifyTemplate = {
  wrap?: (content: React.ReactElement<any>[], hasError?: boolean, hasPreview?: boolean) => React.ReactElement<any>;
  loader?: () => React.ReactElement<any>;
  message?: (message: string) => React.ReactElement<any>;
  preview?: (message: string, filename: React.ReactElement<any>) => React.ReactElement<any>;
  filename?: (filename: string) => React.ReactElement<any>;
  clearButton?: (label: string) => React.ReactElement<any>;
  errorLine?: (message: string) => React.ReactElement<any>;
  errorsContainer?: (content: React.ReactElement<any>[]) => React.ReactElement<any>;
}
interface DropifyProps extends FormFieldProps {
  maxFileSize?: string;
  minWidth?: number;
  maxWidth?: number;
  maxHeight?: number;
  minHeight?: number;
  showRemove?: boolean;
  showLoader?: boolean;
  showErrors?: boolean;
  showInfo?: boolean;
  errorTimeout?: number;
  imgFileExtensions?: string[];
  maxFileSizePreview?: string;
  allowedFormats?: DropifyAllowedFormat[];
  allowedFileExtensions?: string[];
  messages?: DropifyMessage;
  error?: DropifyErrorMessage;
}

interface DropifyState extends FormFieldState {
  loaderActive: boolean;
  hovered: boolean;
  loadedFileInfo: {
    name: string;
    size: number;
    type: string;
    width?: number;
    height?: number;
    previewable: boolean;
  }
}

export class Dropify extends Field<DropifyProps, DropifyState, HTMLInputElement> {
  className = "file-upload";
  constructor(props: DropifyProps, ctx) {
    super(props, ctx);
  }

  protected initState(): DropifyState {
    return Object.assign(super.initState(), {
      loaderActive: false,
      hovered: false,
      loadedFileInfo: {
        name: "",
        type: "",
        size: 0,
        width: 0,
        height: 0,
        previewable: false
      }
    });
  }

  get mergedProps(): DropifyProps {
    return Object.assign({
      defaultFile: '',
      maxFileSize: "",
      minWidth: 0,
      maxWidth: 0,
      minHeight: 0,
      maxHeight: 0,
      showRemove: true,
      showLoader: true,
      showErrors: true,
      showInfo: true,
      errorTimeout: 0,
      imgFileExtensions: ['png', 'jpg', 'jpeg', 'gif', 'bmp'],
      maxFileSizePreview: "5M",
      allowedFileExtensions: ['*'],
      allowedFormats: ['portrait', 'landscape', 'square'],
      messages: {
        default: 'dropify:message.default',
        replace: 'dropify:message.replace',
        remove: 'dropify:message.remove',
        error: 'dropify:message.error'
      },
      error: {
        fileSize: 'dropify:error.file_size',
        minWidth: 'dropify:error.min_width',
        maxWidth: 'dropify:error.max_width',
        minHeight: 'dropify:error.min_height',
        maxHeight: 'dropify:error.max_height',
        imageFormat: 'dropify:error.image_format',
        fileExtension: 'dropify:error.file_extension'
      }
    }, this.props);
  }

  removeElement = () => {
    this.state.errors = [];
    this.state.loadedFileInfo = {
      name: "",
      size: 0,
      type: "",
      width: 0,
      height: 0,
      previewable: false
    };
    this.state.loaderActive = false;
    this.setState(this.state);
  }

  onChange = () => {
    this.resetPreview();
    this.readFile();
  }

  resetPreview() {
    this.state.loadedFileInfo = {
      name: "",
      size: 0,
      type: "",
      width: 0,
      height: 0,
      previewable: false
    }
  }

  getImageFormat(): DropifyAllowedFormat {
    if (this.state.loadedFileInfo.width == this.state.loadedFileInfo.height)
      return "square";
    if (this.state.loadedFileInfo.width < this.state.loadedFileInfo.height)
      return "portrait";
    if (this.state.loadedFileInfo.width > this.state.loadedFileInfo.height)
      return "landscape";
  }

  validateImage() {
    if (this.mergedProps.minWidth !== 0 && this.mergedProps.minWidth >= this.state.loadedFileInfo.width) {
      this.state.errors.push(this.i18n.t(this.mergedProps.error.minWidth, { value: this.mergedProps.minWidth } as any));
    }

    if (this.mergedProps.maxWidth !== 0 && this.mergedProps.maxWidth <= this.state.loadedFileInfo.width) {
      this.state.errors.push(this.i18n.t(this.mergedProps.error.maxWidth, { value: this.mergedProps.maxWidth } as any));
    }

    if (this.mergedProps.minHeight !== 0 && this.mergedProps.minHeight >= this.state.loadedFileInfo.height) {
      this.state.errors.push(this.i18n.t(this.mergedProps.error.minHeight, { value: this.mergedProps.minHeight } as any));
    }

    if (this.mergedProps.maxHeight !== 0 && this.mergedProps.maxHeight <= this.state.loadedFileInfo.height) {
      this.state.errors.push(this.i18n.t(this.mergedProps.error.maxHeight, { value: this.mergedProps.maxHeight } as any));
    }

    if (this.mergedProps.allowedFormats.indexOf(this.getImageFormat()) == -1) {
      this.state.errors.push(this.i18n.t(this.mergedProps.error.imageFormat, { value: this.mergedProps.allowedFormats.join(", ") } as any));
    }
  }

  readFile() {
    if (this.childControl.files && this.childControl.files[0]) {
      let file = this.childControl.files[0];
      this.state.isDirty = true;
      this.state.isTouched = true;
      this.state.errors = [];
      if (this.mergedProps.showLoader)
        this.state.loaderActive = true;

      this.state.loadedFileInfo = {
        name: file.name,
        size: file.size,
        type: file.type,
        width: 0,
        height: 0,
        previewable: false
      }

      this.setState(this.state, () => {
        this.checkFileSize();
        this.isFileExtensionAllowed();
        this.state.isDirty = this.state.errors.length === 0;
        if (this.state.errors.length === 0 && this.isImage() && file.size < this.sizeToByte(this.mergedProps.maxFileSizePreview)) {
          let reader = new FileReader();
          reader.addEventListener("load", () => {
            this.value(reader.result.split(',')[1]);            
            let image = new Image();
            image.src = reader.result;
            image.onload = () => {
              this.state.loadedFileInfo.width = image.width;
              this.state.loadedFileInfo.height = image.height;
              this.state.loadedFileInfo.previewable = true;
              this.validateImage();
              this.state.isDirty = this.state.errors.length === 0;
              this.setState(this.state, () => { this.onFileReady(); });
            }
          });
          reader.readAsDataURL(file);
        } else {
          this.setState(this.state, () => { this.onFileReady(); });
        }
      });
    }
  }

  onFileReady() {
    if (this.mergedProps.errorTimeout > 0) {
      setTimeout(() => {
        this.state.errors = [];
        this.setState(this.state);
      }, this.mergedProps.errorTimeout);
    }
    this.childControl.value = '';
  }

  getFileType() {
    return this.state.loadedFileInfo.name.split('.').pop().toLowerCase();
  }

  isFileExtensionAllowed() {
    if (this.mergedProps.allowedFileExtensions.indexOf('*') !== -1 ||
      this.mergedProps.allowedFileExtensions.indexOf(this.getFileType()) !== -1) {
      return true;
    }
    this.state.errors.push(this.i18n.t(this.mergedProps.error.fileExtension, { value: this.mergedProps.allowedFileExtensions.join(",") } as any));
    return false;
  }

  isImage() {
    return this.mergedProps.imgFileExtensions.indexOf(this.getFileType()) !== -1;
  }

  checkFileSize() {
    const maxSize = this.sizeToByte(this.mergedProps.maxFileSize);
    if (maxSize !== 0 && this.state.loadedFileInfo.size > maxSize) {
      this.state.errors.push(this.i18n.t(this.mergedProps.error.fileSize, { value: this.mergedProps.maxFileSize } as any));
    }
  }

  sizeToByte(size: string): number {
    var value = 0;

    if (size) {
      var unit = size.slice(-1).toUpperCase(),
        kb = 1024,
        mb = kb * 1024,
        gb = mb * 1024;

      if (unit === 'K') {
        value = parseFloat(size) * kb;
      } else if (unit === 'M') {
        value = parseFloat(size) * mb;
      } else if (unit === 'G') {
        value = parseFloat(size) * gb;
      }
    }

    return value;
  }

  renderErrors() {
    return <div className={"dropify-errors-container" + (this.state.errors.length > 0 ? " visible " : "") + (this.state.hovered ? " hovered " : "")}><ul>
      {this.state.errors.map(e => <li>{e}</li>)}
    </ul></div>;
  }

  renderFilename() {
    if (this.state.loadedFileInfo.name && this.mergedProps.showInfo) {
      return <p className="dropify-filename">
        <span className="file-icon"></span>
        <span className="dropify-filename-inner">{this.state.loadedFileInfo.name}</span>
      </p>;
    }
    return null;
  }

  renderPreview() {
    const imageStyle: React.CSSProperties = this.mergedProps.maxHeight > 0 ? { maxHeight: this.mergedProps.maxHeight } : {};
    return <div className="dropify-preview">
      <span className="dropify-render">
        {this.state.loadedFileInfo.previewable ? <img src={`data:${this.state.loadedFileInfo.type};base64,${this.state.value}`} style={imageStyle} />
          : <span>
            <i className="dropify-font-file" /><span className="dropify-extension">{this.getFileType()}</span>
          </span>}
      </span>
      <div className="dropify-infos">
        <div className="dropify-infos-inner">
          {this.renderFilename()}
          <p className="dropify-infos-message">{this.i18n.t(this.mergedProps.messages.replace)}</p>
        </div>
      </div>
    </div>;
  }

  renderChild() {
    return <div className={"dropify-wrapper" + (this.state.errors.length > 0 ? " has-error " : (this.state.loadedFileInfo.name ? " has-preview " : ""))}>
      <div className="dropify-message">
        <span className="file-icon" />
        <p>{this.i18n.t(this.mergedProps.messages.default)}</p>
        {this.state.errors.length > 0 ? <p className="dropify-error">{this.i18n.t(this.mergedProps.messages.error)}</p> : null}
      </div>
      {this.mergedProps.showLoader && this.state.loaderActive ? <div className="dropify-loader" /> : null}
      {this.renderPreview()}
      {this.mergedProps.showErrors ? this.renderErrors() : null}
      <input type="file" onChange={this.onChange} ref={(c) => this.childControl = c} onMouseEnter={() => { this.state.hovered = true; this.setState(this.state) } } onMouseOut={() => { this.state.hovered = false; this.setState(this.state) } } />
      {!this.mergedProps.disabled && this.mergedProps.showRemove ? <button className="dropify-clear" type="button" onClick={this.removeElement}>{this.i18n.t(this.mergedProps.messages.remove)}</button> : null}
    </div>;
  }
}