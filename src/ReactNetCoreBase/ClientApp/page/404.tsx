import * as React from 'react';
import { PageTitle } from './component';
import { BaseComponent } from '../provider';

export class PageNotFound extends BaseComponent<any, void> {
    render() {
        return (
            <PageTitle title={this.i18n.t("common:page_not_found_title")}>
                <div className="center-xs row">
                    <div className="col-xs-12">
                        <p className="page-not-found-msg">
                            {this.i18n.t("common:message.page_not_found")}
                        </p>
                    </div>
                </div>
            </PageTitle>
        );
    }
}